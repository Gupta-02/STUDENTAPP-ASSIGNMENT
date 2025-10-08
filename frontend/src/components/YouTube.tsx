import { useState } from 'react';
import { Youtube, Play, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/useApp';
import { recommendYouTubeVideos } from '../lib/aiService';

export function YouTube() {
  const { selectedPdfIds, pdfs } = useApp();
  const [videos, setVideos] = useState<Array<{
    videoId: string;
    title: string;
    channel: string;
    thumbnailUrl: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');

  const selectedPdfs = pdfs.filter(p => selectedPdfIds.includes(p.id));

  const handleLoadVideos = async (topic: string) => {
    setCurrentTopic(topic);
    setLoading(true);
    try {
      const videoResults = await recommendYouTubeVideos(topic);
      setVideos(videoResults);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedTopics = () => {
    const topics = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
    const pdfTopics = selectedPdfs.map(pdf => pdf.title.toLowerCase());

    // Add PDF-specific topics
    pdfTopics.forEach(topic => {
      if (topic.includes('physics') && !topics.includes('Physics')) topics.push('Physics');
      if (topic.includes('chemistry') && !topics.includes('Chemistry')) topics.push('Chemistry');
      if (topic.includes('math') && !topics.includes('Mathematics')) topics.push('Mathematics');
      if (topic.includes('biology') && !topics.includes('Biology')) topics.push('Biology');
    });

    return topics;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Youtube className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-black">Educational Videos</h2>
        </div>
        <p className="text-gray-600">Discover helpful video tutorials for your selected topics</p>
      </div>

      {/* Topic Selection */}
      <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Choose a Topic</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {getSuggestedTopics().map((topic) => (
            <button
              key={topic}
              onClick={() => handleLoadVideos(topic)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                currentTopic === topic
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-gray-300 hover:border-red-400'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {selectedPdfIds.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-black mb-2">From Selected PDFs:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPdfs.map((pdf) => (
                <button
                  key={pdf.id}
                  onClick={() => handleLoadVideos(pdf.title)}
                  className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {pdf.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            Loading videos...
          </div>
        </div>
      )}

      {videos.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.videoId} className="bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-black mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.channel}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && currentTopic && (
        <div className="text-center py-8">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No videos found for "{currentTopic}"</p>
          <p className="text-sm text-gray-500 mt-1">Try selecting a different topic</p>
        </div>
      )}

      {!currentTopic && (
        <div className="text-center py-12">
          <Youtube className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Select a Topic</h3>
          <p className="text-gray-600">Choose a subject above to discover educational videos</p>
        </div>
      )}
    </div>
  );
}