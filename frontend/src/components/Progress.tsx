import { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Target, Youtube } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { recommendYouTubeVideos } from '../lib/aiService';

export function Progress() {
  const { progress, quizAttempts, pdfs } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<Array<{
    videoId: string;
    title: string;
    channel: string;
    thumbnailUrl: string;
  }>>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const weakAreas = progress
    .filter((p) => p.strengthScore < 60)
    .sort((a, b) => a.strengthScore - b.strengthScore)
    .slice(0, 5);

  const strongAreas = progress
    .filter((p) => p.strengthScore >= 70)
    .sort((a, b) => b.strengthScore - a.strengthScore)
    .slice(0, 5);

  const totalQuizzes = quizAttempts.length;
  const avgScore =
    totalQuizzes > 0
      ? quizAttempts.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / totalQuizzes
      : 0;

  const handleLoadVideos = async (topic: string) => {
    setSelectedTopic(topic);
    setLoadingVideos(true);
    try {
      const videos = await recommendYouTubeVideos(topic);
      setYoutubeVideos(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Learning Progress</h2>
        <p className="text-gray-600">Track your strengths and areas for improvement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Quizzes Taken</span>
            <Award className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold text-black">{totalQuizzes}</div>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Average Score</span>
            <Target className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold text-black">{avgScore.toFixed(1)}%</div>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Topics Covered</span>
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold text-black">{progress.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-black">Strong Areas</h3>
          </div>

          {strongAreas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Take quizzes to see your strong areas
            </p>
          ) : (
            <div className="space-y-3">
              {strongAreas.map((item, index) => {
                const pdf = pdfs.find((p) => p.id === item.pdfId);
                return (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-black">{item.topic}</h4>
                      <span className="text-sm font-bold text-green-600">
                        {item.strengthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${item.strengthScore}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{pdf?.title || 'Unknown PDF'}</span>
                      <span>
                        {item.correctAnswers}/{item.totalAnswers} correct
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-black">Needs Improvement</h3>
          </div>

          {weakAreas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Take quizzes to identify areas for improvement
            </p>
          ) : (
            <div className="space-y-3">
              {weakAreas.map((item, index) => {
                const pdf = pdfs.find((p) => p.id === item.pdfId);
                return (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-black">{item.topic}</h4>
                      <span className="text-sm font-bold text-red-600">
                        {item.strengthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${item.strengthScore}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>{pdf?.title || 'Unknown PDF'}</span>
                      <span>
                        {item.correctAnswers}/{item.totalAnswers} correct
                      </span>
                    </div>
                    <button
                      onClick={() => handleLoadVideos(item.topic)}
                      className="w-full bg-black text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Youtube className="w-4 h-4" />
                      Find Learning Videos
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedTopic && (
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black">Recommended Videos</h3>
              <p className="text-sm text-gray-600">Learning resources for: {selectedTopic}</p>
            </div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-sm text-gray-600 hover:text-black"
            >
              Close
            </button>
          </div>

          {loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {youtubeVideos.map((video, index) => (
                <a
                  key={index}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors group"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Youtube className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-black text-sm mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-600">{video.channel}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {progress.length === 0 && quizAttempts.length === 0 && (
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black mb-2">No Progress Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Take some quizzes to start tracking your learning progress
          </p>
        </div>
      )}
    </div>
  );
}
