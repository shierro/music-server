/* eslint-disable prefer-promise-reject-errors */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const AWS = require('aws-sdk');
const awsService = require('../services/aws');
const s3Bucket = require('../middlewares/S3bucket');
const server = require('../index');

describe('src/controllers/Songs.js', () => {
  it('should be able to get all songs successfully', async () => {
    const mockSongs = [{ Size: 100 }];
    const stub = sinon.stub(awsService, 'getBucketContent').callsFake(() => mockSongs);
    const result = await request(server)
      .get('/api/songs')
      .send();
    expect(result.status).to.equal(200);
    expect(JSON.parse(result.text)).to.deep.equal(mockSongs);
    stub.restore();
  });

  it('should fail gracefully when there is an error thrown', async () => {
    const error = { message: 'connection timeout' };
    const reject = Promise.reject(error);
    const stub = sinon.stub(awsService, 'getBucketContent').callsFake(() => reject);
    const result = await request(server)
      .get('/api/songs')
      .send();
    expect(result.status).to.equal(500);
    expect(JSON.parse(result.text)).to.deep.equal({ ...error, status: 500 });
    stub.restore();
  });

  it('should get song by key successfully', async () => {
    const fakeFnc = (res) => {
      res.send('ok');
      return { on: () => true };
    };
    const stub = sinon.stub(AWS.Request.prototype, 'forwardToExpressResp').callsFake(fakeFnc);
    const result = await request(server)
      .get('/api/songs/testKey')
      .send();
    expect(result.status).to.equal(200);
    expect(result.text).to.equal('ok');
    stub.restore();
  });

  it('should get song metadata by key successfully', async () => {
    const testData = { Metadata: { Size: 5 } };
    const fakeFnc = () => ({ promise: () => testData });
    const stub = sinon.stub(awsService.s3, 'headObject').callsFake(fakeFnc);
    const result = await request(server)
      .get('/api/songs/testKey/metadata')
      .send();
    expect(result.status).to.equal(200);
    expect(JSON.parse(result.text)).to.deep.equal(testData.Metadata);
    stub.restore();
  });

  it('should return code 404 if key does not exist on s3 bucket', async () => {
    const fakeFnc = () => ({ promise: () => Promise.reject({ code: 'NotFound' }) });
    const stub = sinon.stub(awsService.s3, 'headObject').callsFake(fakeFnc);
    const result = await request(server)
      .get('/api/songs/testKey/metadata')
      .send();
    expect(result.status).to.equal(404);
    expect(JSON.parse(result.text)).to.deep.equal({ status: 404, message: 'Key does not exist' });
    stub.restore();
  });

  it('should return code 500 on any generic error', async () => {
    const error = { message: 'unknown error' };
    const fakeFnc = () => ({ promise: () => Promise.reject(error) });
    const stub = sinon.stub(awsService.s3, 'headObject').callsFake(fakeFnc);
    const result = await request(server)
      .get('/api/songs/testKey/metadata')
      .send();
    expect(result.status).to.equal(500);
    expect(JSON.parse(result.text)).to.deep.equal({ status: 500, ...error });
    stub.restore();
  });

  // unable to stub middleware function uploadSongs!
  // TODO: fix this unit test
  it.skip('should be able to test', async () => {
    const fakeFnc = (req, res, next) => {
      req.files = [{ key: 1, originalname: 'origFile1' }];
      next();
    };
    const stub = sinon.stub(s3Bucket, 'uploadSongs').callsFake(fakeFnc);
    const server2 = require('../index');
    const result = await request(server2)
      .post('/api/songs')
      .attach('songs', `${process.cwd()}/test-helper/test.mp3`)
      .attach('songs', `${process.cwd()}/test-helper/test2.mp3`);
    expect(result.status).to.equal(200);
    stub.restore();
  });
});
