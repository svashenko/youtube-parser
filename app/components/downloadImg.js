import * as fs from 'fs';
import https from 'https'

async function downloadImg(url, path) {
  try {
    https.get(url, res => res.pipe(fs.createWriteStream(path)));
    
    console.log('Image has been downloaded: ', path);
  } catch (error) {
    console.error('Error downloading image: ', error.message);
    return null;
  }
}

export default downloadImg;