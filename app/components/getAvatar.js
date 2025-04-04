import axios from 'axios';
import * as cheerio from 'cheerio';

async function getAvatar(id) {
  try {
    const url = `https://www.youtube.com/channel/${id}`;
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    const $ = cheerio.load(data);
    const avatarUrl = $('meta[property="og:image"]').attr('content');

    if (!avatarUrl) throw new Error('Avatar not found.');
    
    return avatarUrl;
  } catch (error) {
    console.error('Error fetching avatar: ', error.message);
    return null;
  }
}

export default getAvatar;