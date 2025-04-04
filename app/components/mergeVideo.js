import ffmpegPath from 'ffmpeg-static';
import Ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

async function mergeVideo(videoPath, audioPath, finalPath) {
  return new Promise((resolve, reject) => {
    Ffmpeg.setFfmpegPath(ffmpegPath);

    Ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(['-c:v copy', '-c:a aac', '-strict experimental'])
      .save(finalPath)
      .on('end', () => {
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
        console.log('Merging complete! Final video: ', finalPath);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error merging video and audio: ', err);
        reject();
      });
  });
}

export default mergeVideo;