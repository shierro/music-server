const logger = require('../utils/logger');

const error404 = (req, res, next) => {
  next({ status: 404, message: 'Not Found' });
};

/* istanbul ignore next */
/* eslint no-unused-vars: 0 */
const generalError = (err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message || 'Server Error',
  };
  if (!res.headersSent) {
    res.status(error.status).json(error);
  }
  logger.error(`Status[${error.status}] response:`, req.path, err);
};

module.exports = {
  error404,
  generalError,
};
