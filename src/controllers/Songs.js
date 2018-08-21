const awsService = require('../services/aws');
const logger = require('../utils/logger');

const { S3_BUCKET_NAME } = process.env;

const SongsController = {
  /**
   * Get all songs
   * @async
   * @function getAll
   * @fires res.json to send song list
   */
  async getAll(req, res, next) {
    try {
      const songs = await awsService.getBucketContent(S3_BUCKET_NAME);
      const filterProps = song => ({
        Key: song.Key,
        LastModified: song.LastModified,
        ETag: song.ETag,
        Size: song.Size,
      });
      res.json(songs.map(filterProps));
    } catch (e) {
      logger.error(e);
      next(e);
    }
  },
  /**
   * Get song by key
   * @function getByKey
   * @fires res.pipe to stream song data
   */
  getByKey({ params: { key } }, res, next) {
    awsService.streamBucketFile(S3_BUCKET_NAME, key, res).on('error', next);
  },
  /**
   * Get song metadata from s3 bucket
   * @async
   * @function getSongMetadata
   * @fires res.json to send song metadata
   */
  async getSongMetadata({ params: { key } }, res, next) {
    try {
      const { Metadata } = await awsService.getFileMetadata(S3_BUCKET_NAME, key);
      res.json(Metadata);
    } catch (e) {
      const error = Object.assign(e);
      logger.error(error);
      if (error.code === 'NotFound') {
        error.status = 404;
        error.message = 'Key does not exist';
      }
      next(error);
    }
  },
  /**
   * Upload songs to s3 success handler.
   * If request gets here, it means that files have been uploaded to s3.
   * @function uploadSuccess
   * @fires res.json to send uploaded keys & song names
   */
  uploadSuccess(req, res) {
    const fileKeys = req.files.map(({ key, originalname }) => ({ key, originalname }));
    res.json(fileKeys);
  },
};

module.exports = SongsController;
