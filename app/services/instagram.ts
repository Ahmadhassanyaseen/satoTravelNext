const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function getInstagramFeed(limit = 6) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch Instagram feed');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return [];
  }
} 