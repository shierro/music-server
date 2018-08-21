const request = require('supertest');
const app = require('..');

describe('Error Controller', () => {
  it(
    'should return 404',
    () => request(app)
      .get('/api/that-did-not-exist')
      .expect(404),
  );
});
