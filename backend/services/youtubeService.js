import axios from 'axios';

/**
 * Search YouTube for educational videos related to a topic
 */
export async function searchYouTubeVideos(topic, maxResults = 5) {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return getSampleVideos(topic);
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${topic} educational tutorial`,
        type: 'video',
        maxResults,
        key: process.env.YOUTUBE_API_KEY,
        relevanceLanguage: 'en',
        safeSearch: 'strict',
      },
    });

    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return getSampleVideos(topic);
  }
}

/**
 * Sample videos when YouTube API is not configured
 */
function getSampleVideos(topic) {
  return [
    {
      id: 'sample1',
      title: `${topic} - Complete Tutorial`,
      description: `Learn about ${topic} in this comprehensive educational video.`,
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+1',
      channelTitle: 'Education Channel',
      url: '#',
    },
    {
      id: 'sample2',
      title: `${topic} Explained Simply`,
      description: `Simple explanation of ${topic} for students.`,
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+2',
      channelTitle: 'Learn Channel',
      url: '#',
    },
    {
      id: 'sample3',
      title: `${topic} - Quick Guide`,
      description: `Quick guide to understanding ${topic}.`,
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+3',
      channelTitle: 'Study Help',
      url: '#',
    },
  ];
}
