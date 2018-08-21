const multer = require('multer');
const multerS3 = require('multer-s3');
const uuidv4 = require('uuid/v4');
const { s3 } = require('../services/aws');

const S3bucket = {
  multer,
  upload: multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      // metadata of file to be uploaded on s3
      metadata: (req, file, cb) => cb(null, file),
      // key of file to be used on s3
      key: (req, file, cb) => cb(null, uuidv4()),
    }),
  }),
};

module.exports = S3bucket;
