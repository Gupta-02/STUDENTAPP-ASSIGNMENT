import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, BookOpen, Award } from 'lucide-react';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set default data for demo
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        totalStudyTime: 0,
        recentQuizzes: [],
        topicPerformance: [],
        scoreDistribution: [],
        weakTopics: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalQuizzes}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageScore}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Study Hours</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalStudyTime}h</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Improvement</p>
              <p className="text-3xl font-bold text-gray-800">+0%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Performance</h2>
          {stats.recentQuizzes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.recentQuizzes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#0ea5e9" name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No quiz data yet. Take some quizzes to see your progress!
            </div>
          )}
        </div>

        {/* Topic Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Topic Performance</h2>
          {stats.topicPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.topicPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.topicPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No topic data available yet
            </div>
          )}
        </div>
      </div>

      {/* Weak Topics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Topics Needing Improvement</h2>
        {stats.weakTopics.length > 0 ? (
          <div className="space-y-3">
            {stats.weakTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{topic.name}</h3>
                  <p className="text-sm text-gray-600">Accuracy: {topic.accuracy}%</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                  Practice More
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Great job! No weak topics identified yet.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats.recentQuizzes.length > 0 ? (
            stats.recentQuizzes.slice(0, 5).map((quiz, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{quiz.pdfName}</p>
                  <p className="text-sm text-gray-500">{quiz.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quiz.score >= 80 ? 'bg-green-100 text-green-800' :
                  quiz.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.score}%
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
