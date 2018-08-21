const multer = require('multer');
const multerS3 = require('multer-s3');
const uuidv4 = require('uuid/v4');
const { s3 } = require('../services/aws');

const metadata = (req, file, cb) => cb(null, file);
const key = (req, file, cb) => cb(null, uuidv4());

const upload = multer({
  storage: multerS3({
    bucket: process.env.S3_BUCKET_NAME,
    key,
    metadata,
    s3,
  }),
});

const S3bucket = {
  multer,
  upload,
  _: { metadata, key },
};

module.exports = S3bucket;
