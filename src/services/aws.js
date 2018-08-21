const AWS = require('aws-sdk');

const s3 = new AWS.S3({ httpOptions: { timeout: 180000 } });

// hack through AWS request object to be able to set http headers
AWS.Request.prototype.getStreamAndSetHeaders = function getStream(res) {
  return this
    .on('httpHeaders', (code, headers) => {
      if (code < 300) {
        res.set(headers);
      }
    })
    .createReadStream();
};

const awsService = {
  s3,
  /**
   * Get s3 bucket content
   * @function getBucketContent
   * @param Bucket Bucket name
   * @returns contents of bucket
   * @throws s3.listObjects() error
   */
  async getBucketContent(Bucket) {
    try {
      const listObjects = await s3.listObjects({ Bucket }).promise();
      return listObjects.Contents;
    } catch (e) {
      return Promise.reject(e);
    }
  },
  /**
   * Get s3 bucket file stream
   * @function getBucketFileReadStream
   * @param Bucket Bucket name
   * @param Key bucket Key
   * @returns nodeJS stream
   */
  getBucketFileReadStream(Bucket, Key, res) {
    return s3.getObject({ Bucket, Key }).getStreamAndSetHeaders(res);
  },
  /**
   * Try to create S3 bucket if it does not exist
   * @async
   * @function tryCreateBucket
   * @param Bucket Bucket name
   * @returns a Promise that resolves an object w/ status
   * @throws create bucket error
   */
  async tryCreateBucket(Bucket) {
    const params = { Bucket };
    try {
      await s3.headBucket(params).promise();
      return { status: 'exists' };
    } catch (e) {
      const meta = await s3.createBucket(params).promise();
      return { status: 'newlyCreated', meta };
    }
  },
  /**
   * Get metadata of a file inside a bucket
   * @function getFileMetadata
   * @param Bucket Bucket name
   * @param Key Bucket key
   * @returns a Promise that resolves/rejects fetch results
   */
  getFileMetadata(Bucket, Key) {
    return s3.headObject({ Bucket, Key }).promise();
  },
};

module.exports = awsService;
