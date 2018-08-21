const { expect } = require('chai');
const validateUuid = require('uuid-validate');
const S3bucket = require('./S3bucket');

describe('src/middlewares/S3bucket.js', () => {
  it('should set all file props as metadata on s3', (done) => {
    const file = { key: 5, size: 10, originalname: 'testOrigName' };
    S3bucket._.metadata(null, file, (err, metadataToSend) => {
      expect(err).to.be.equal(null);
      expect(metadataToSend).to.deep.equal(file);
      done(err);
    });
  });
  it('should generate a valid uuid v4', (done) => {
    S3bucket._.key(null, null, (err, result) => {
      expect(err).to.be.equal(null);
      expect(validateUuid(result, 4)).to.equal(true);
      done(err);
    });
  });
});
