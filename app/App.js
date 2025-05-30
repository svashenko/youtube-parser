import youtubeDl from 'youtube-dl-exec';
import * as fs from 'fs';
import path from 'path';
import pkg from 'xlsx';
const { readFile } = pkg;

import formatDate from './components/formatDate.js';
import downloadImg from './components/downloadImg.js';
import getAvatar from './components/getAvatar.js';
import mergeVideo from './components/mergeVideo.js';
import createExel from './components/createExel.js';
import writeExel from './components/writeExel.js';

async function App(url) {
  const downloadsDir = './app/downloads';
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  const exelPath = path.join(downloadsDir, 'horizontal_videos.xlsx');
  const workbook = fs.existsSync(exelPath) ? readFile(exelPath) : createExel(exelPath);

  let avatarPath, thumbnailPath, videoPath, audioPath, finalPath;

  try {
    const raw = await youtubeDl(url, { dumpSingleJson: true, addHeader: ['referer:youtube.com', 'user-agent:googlebot'], cookies: './app/cookies.txt' });

    const data = {
      'Link': raw.webpage_url,
      'Language': raw.language.toUpperCase(),
      'Author_Name': raw.channel,
      'Name': raw.title,
      'Length': raw.duration_string,
      'Description': raw.description,
      'Views': raw.view_count,
      'Likes': raw.like_count,
      'Comments': raw.comment_count,
      'Date': formatDate(raw.upload_date),
      'Video_File': `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`,
      'Preview_File': `media_${Date.now()}.jpg`,
      'Author_Picture_File': `author_${Date.now()}.jpg`,
      'Followers': raw.channel_follower_count,
      'Genre': raw.categories.toString(),
    };

    avatarPath = path.join(downloadsDir, data.Author_Picture);
    downloadImg(await getAvatar(raw.channel_id), avatarPath);

    thumbnailPath = path.join(downloadsDir, data.Media_Picture);
    downloadImg(raw.thumbnail, thumbnailPath);

    videoPath = path.join(downloadsDir, 'videoOnly.mp4');
    await youtubeDl(url, { f: '136/135/134/bestvideo[ext=mp4]', o: videoPath, cookies: './app/cookies.txt' });

    audioPath = path.join(downloadsDir, 'audioOnly.m4a');
    await youtubeDl(url, { f: '140/bestaudio[ext=m4a]', o: audioPath, cookies: './app/cookies.txt' });

    finalPath = path.join(downloadsDir, data.Media);
    await mergeVideo(videoPath, audioPath, finalPath);

    await writeExel(workbook, data, exelPath);

    return 'Done!';
  } catch (error) {
    console.log('Cleaning files because of: ', error.message);

    if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);

    return error.message;
  }
}

export default App;