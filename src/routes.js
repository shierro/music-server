const express = require('express');
const healthcheck = require('express-healthcheck');
const ErrorController = require('./controllers/Error');
const SongsController = require('./controllers/Songs');
const authService = require('./services/auth');
const S3bucket = require('./middlewares/S3bucket');

const basicAuth = authService.basic();

module.exports = (app) => {
  /* Songs */
  const songs = express.Router();
  songs.get('/', SongsController.getAll);
  songs.get('/:key', SongsController.getByKey);
  songs.get('/:key/metadata', SongsController.getSongMetadata);
  songs.post('/', S3bucket.upload.array('songs', 10), SongsController.uploadSuccess);

  /* APIs */
  app.use('/api/songs', songs);

  /* Status */
  app.use('/healthcheck', basicAuth, healthcheck());

  /* Error Handling */
  app.use(ErrorController.error404);
  app.use(ErrorController.generalError);
};
