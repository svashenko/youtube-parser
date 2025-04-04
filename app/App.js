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

  const exelPath = path.join(downloadsDir, 'YouTube.xlsx');
  const workbook = fs.existsSync(exelPath) ? readFile(exelPath) : createExel(exelPath);

  let avatarPath, thumbnailPath, videoPath, audioPath, finalPath;

  try {
    const raw = await youtubeDl(url, { dumpSingleJson: true, addHeader: ['referer:youtube.com', 'user-agent:googlebot'] });

    const data = {
      'Link': raw.webpage_url,
      'Language': raw.language.toUpperCase(),
      'Views': raw.view_count,
      'Followers': raw.channel_follower_count,
      'Likes': raw.like_count,
      'Comments': raw.comment_count,
      'Date': formatDate(raw.upload_date),
      'Length': raw.duration_string,
      'Genre': raw.categories.toString(),
      'Author_Name': raw.channel,
      'Author_Picture': `author_${Date.now()}.jpg`,
      'Name': raw.title,
      'Media_Picture': `media_${Date.now()}.jpg`,
      'Media': `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`,
      'Description': raw.description,
    };

    avatarPath = path.join(downloadsDir, data.Author_Picture);
    downloadImg(await getAvatar(raw.channel_id), avatarPath);

    thumbnailPath = path.join(downloadsDir, data.Media_Picture);
    downloadImg(raw.thumbnail, thumbnailPath);

    videoPath = path.join(downloadsDir, 'videoOnly.mp4');
    await youtubeDl(url, { f: '136/135/134/bestvideo[ext=mp4]', o: videoPath });

    audioPath = path.join(downloadsDir, 'audioOnly.m4a');
    await youtubeDl(url, { f: '140/bestaudio[ext=m4a]', o: audioPath });

    finalPath = path.join(downloadsDir, data.Media);
    await mergeVideo(videoPath, audioPath, finalPath);

    await writeExel(workbook, data, exelPath);

    console.log('DONE!!!');
    return 'DONE!!!';
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