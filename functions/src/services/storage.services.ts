import * as admin from 'firebase-admin';
import * as Busboy from 'busboy';

export const createFileInStorage = (options: { headers: any, filename: string, rawBody: any }) => {
  /** @see https://stackoverflow.com/questions/47242340/how-to-perform-an-http-file-upload-using-express-on-cloud-functions-for-firebase */

  const busboy = new Busboy({ headers: options.headers });

  const streamWriter = admin.storage()
    .bucket()
    .file(options.filename)
    .createWriteStream()
    ;

  return new Promise((resolve, reject) => {
    busboy.on('file', (fieldname: string, file: any, filename: string, encoding: string, mimetype: string) => {
      console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
      file.pipe(streamWriter);
    });

    // This callback will be invoked after all uploaded files are saved.
    busboy.on('finish', () => {
      resolve();
    });

    busboy.on('error', (err: any) => {
      reject(err);
    })

    // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
    // a callback when it's finished.
    busboy.end(options.rawBody);
  });
}

export const writeFileInStorage = (file: Express.Multer.File): Promise<void> => {
  const writeStream = admin.storage()
    .bucket()
    .file(file.filename)
    .createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

  writeStream.write(file.stream);
  return new Promise((resolve, reject) => {
    writeStream.end(() => {
      resolve();
    });
    writeStream.on('error', (err) => {
      reject(err);
    });
  });
}
