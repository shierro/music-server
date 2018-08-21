/* eslint-disable prefer-promise-reject-errors */
const { expect } = require('chai');
const sinon = require('sinon');
const awsService = require('./aws');

describe('src/services/aws.js', () => {
  it('should be able to get bucket content successfully', async () => {
    const Contents = [{ Size: 5 }];
    const mockListObjects = () => ({ promise: () => ({ Contents }) });
    const stub = sinon.stub(awsService.s3, 'listObjects').callsFake(mockListObjects);
    const result = await awsService.getBucketContent('SampleBucket', 'key');
    expect(result).to.deep.equal(Contents);
    stub.restore();
  });

  it('should catch error when trying to get bucket content', async () => {
    const error = { message: 'error' };
    const mockListObjects = () => ({ promise: () => Promise.reject(error) });
    const stub = sinon.stub(awsService.s3, 'listObjects').callsFake(mockListObjects);
    try {
      await awsService.getBucketContent('SampleBucket', 'key');
    } catch (e) {
      expect(e).to.deep.equal(error);
      stub.restore();
    }
  });

  it('should not create bucket if it exists', async () => {
    const mockListObjects = () => ({ promise: () => true });
    const stub = sinon.stub(awsService.s3, 'headBucket').callsFake(mockListObjects);
    const result = await awsService.tryCreateBucket('SampleBucket');
    expect(result).to.deep.equal({ status: 'exists' });
    stub.restore();
  });

  it('should create bucket if it does not exist', async () => {
    const mockListObjects = () => ({ promise: () => Promise.reject({ exists: false }) });
    const mockCreateBucket = () => ({ promise: () => true });
    const stubs = [
      sinon.stub(awsService.s3, 'headBucket').callsFake(mockListObjects),
      sinon.stub(awsService.s3, 'createBucket').callsFake(mockCreateBucket),
    ];
    const result = await awsService.tryCreateBucket('SampleBucket');
    expect(result).to.deep.equal({ status: 'newlyCreated', meta: true });
    stubs.forEach(stub => stub.restore());
  });
});
