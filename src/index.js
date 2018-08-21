require('dotenv-safe').config();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const registerRoutes = require('./routes');
const awsService = require('./services/aws');
const logger = require('./utils/logger');

const {
  CREATE_BUCKET_IF_NOT_EXIST,
  NODE_ENV,
  PORT,
  S3_BUCKET_NAME,
} = process.env;

const app = express();
app.server = http.createServer(app);

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('morgan')('short', { stream: logger.logStream }));

registerRoutes(app);

/* istanbul ignore next */
async function initialize() {
  if (CREATE_BUCKET_IF_NOT_EXIST === 'true') {
    await awsService.tryCreateBucket(S3_BUCKET_NAME);
  }
  app.server.listen(PORT || 8080, () => {
    logger.info(`ENV[${NODE_ENV}] Started on port ${app.server.address().port}`);
  });
}

initialize();

module.exports = app;
