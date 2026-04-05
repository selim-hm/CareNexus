const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');
const { PassThrough } = require('stream');
const ffmpeg = require('fluent-ffmpeg');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size to support videos
  }
});

// Helper: Compress video using ffmpeg
function compressVideo(buffer, type) {
  return new Promise((resolve, reject) => {
    const inputStream = streamifier.createReadStream(buffer);
    const outputChunks = [];
    const outputStream = new PassThrough();

    outputStream.on('data', (chunk) => outputChunks.push(chunk));
    outputStream.on('end', () => resolve(Buffer.concat(outputChunks)));
    outputStream.on('error', reject);

    let command = ffmpeg(inputStream).format('mp4');
    
    // Resize video to a max width of 720, preserving aspect ratio, and lower bitrate
    command = command
      .videoCodec('libx264')
      .size('?x720')
      .videoBitrate('1000k')
      .audioCodec('aac')
      .audioBitrate('128k');

    command.on('error', (err) => {
      console.error('ffmpeg error:', err);
      // Fallback: if ffmpeg fails, just resolve with original buffer to not break the upload
      resolve(buffer); 
    }).pipe(outputStream, { end: true });
  });
}

async function optimizeAndPrepare(req, res, next) {
  if (!req.files && !req.file) return next();

  try {
    const filesToProcess = req.files ? req.files : [req.file];
    
    const processedFiles = await Promise.all(
      filesToProcess.map(async (file) => {
        let buffer = file.buffer;

        if (file.mimetype.startsWith('image/')) {
          // Convert all images to optimized WebP
          buffer = await sharp(buffer)
            .resize({ width: 1200, withoutEnlargement: true }) // Larger max width for better quality
            .webp({ quality: 80 }) // Modern web format, highly optimized
            .toBuffer();
            
          file.mimetype = 'image/webp';
          file.originalname = file.originalname.replace(/\.[^/.]+$/, "") + ".webp";
          file.buffer = buffer;

        } else if (file.mimetype.startsWith('video/')) {
          // Compress video using ffmpeg
          buffer = await compressVideo(buffer, 'mp4');
          
          file.mimetype = 'video/mp4';
          file.originalname = file.originalname.replace(/\.[^/.]+$/, "") + ".mp4";
          file.buffer = buffer;

        } 
        // We leave audio and documents as they are to avoid ffmpeg breaking them unnecessarily.
        // Gzipping them in multer is bad practice since GCS/S3 should handle gzip and CDNs serve it.
        
        return file;
      })
    );

    if (req.files) {
      req.files = processedFiles;
    } else {
      req.file = processedFiles[0];
    }
    
    next();
  } catch (err) {
    console.error('Error optimizing files:', err);
    // Don't completely fail, pass through to avoid breaking core functionality
    next(); 
  }
}

module.exports = { upload, optimizeAndPrepare };