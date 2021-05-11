import regionalFunctions from '../regionalFunctions';
import { db, storage } from '../config';

const mkdirp = require('mkdirp');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child-process-promise').spawn;
const execFile = require('child-process-promise').execFile;

ffmpeg.setFfmpegPath(ffmpegPath);

const THUMB_SUFFIX = '_thumb';
const THUMB_MAX_WIDTH = 256;
const THUMB_MAX_HEIGHT = 188;

export const onFileInBucketCreate = regionalFunctions.storage
  .object()
  .onFinalize(async (object: any) => {
    try {
      const filePath = object.name;
      const contentType = object.contentType;
      const fileDir = path.dirname(filePath);
      const fileName = path.basename(filePath);
      const fileNameNoExtension = path.parse(fileName).name;
      const thumbFilePath = path.normalize(
        path.join(fileDir, `${fileNameNoExtension}${THUMB_SUFFIX}.png`)
      );
      const tempLocalFile = path.join(os.tmpdir(), fileName);
      const tempLocalDir = path.dirname(tempLocalFile);
      const tempLocalThumbFileName = 'thumbnail.png';
      const tempLocalThumbFile = path.join(os.tmpdir(), tempLocalThumbFileName);

      const isVideo = contentType.startsWith('video/');
      const isImage = contentType.startsWith('image/');

      let width;
      let height;

      if (fileNameNoExtension.endsWith('_thumb')) {
        console.log('=== This is already a thumbnail.');
        return;
      }

      if (!(isVideo || isImage)) {
        console.log('=== Unsupported file type');
      }

      const bucket = storage.bucket(object.bucket);
      const file = bucket.file(filePath);

      await mkdirp(tempLocalDir);
      await file.download({ destination: tempLocalFile });

      if (isVideo) {
        await new Promise<void>((resolve, reject) => {
          ffmpeg(tempLocalFile)
            .screenshot({
              filename: tempLocalThumbFileName,
              folder: tempLocalDir,
              count: 1,
              timemarks: ['0'],
              size: `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`,
            })
            .on('end', () => {
              console.log('=== ffmpeg convert success');
              resolve();
            })
            .on('error', () => {
              console.log('=== ffmpeg convert faild');
              reject();
            });
        });

        await new Promise<void>((resolve, reject) => {
          ffmpeg.ffprobe(tempLocalFile, (err, metadata) => {
            if (err) reject();
            else {
              width = metadata.streams[0].width;
              height = metadata.streams[0].height;
              resolve();
            }
          });
        });
      } else if (isImage) {
        await spawn(
          'convert',
          [
            tempLocalFile,
            '-thumbnail',
            `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
            tempLocalThumbFile,
          ],
          { capture: ['stdout', 'stderr'] }
        );

        const { stdout } = await execFile(
          'identify',
          ['-format', '%wx%h', tempLocalFile],
          {
            capture: ['stdout', 'stderr'],
          }
        );

        width = Number(stdout.split('x')[0]);
        height = Number(stdout.split('x')[1]);
      } else {
        return;
      }

      const uploadOptions = {
        destination: thumbFilePath,
        public: true,
      };

      await bucket.upload(tempLocalThumbFile, uploadOptions);

      const uploadedThumbFile = bucket.file(thumbFilePath);
      const thumbUrl = await uploadedThumbFile.publicUrl();

      await db.collection('files').doc(fileNameNoExtension).update({
        thumbnail: thumbUrl,
        width,
        height,
      });

      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempLocalThumbFile);
    } catch (error) {
      console.log('=== error catched', error);
    }

    return;
  });
