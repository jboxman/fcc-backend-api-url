import express from 'express';
import redis from 'redis';
import bodyParser from 'body-parser';

import encodeController from './server/controllers/encodeController';
import decodeController from './server/controllers/decodeController';
import statsController from './server/controllers/statsController';
import redirectController from './server/controllers/redirectController';

import urlModel from './server/models/urlModel';

const {REDIS_URL} = process.env;

const client = redis.createClient({url: REDIS_URL});
const model = urlModel({client});

// For testing:
// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
export default function() {
  const app = express();

  const port = process.env.PORT || 3100;

  // __dirname is '/' after babel
  app.use(express.static(`${process.cwd()}/public`));

  app.use(bodyParser.json());

  app.use('/', redirectController);

  // Import other functions
  app.use('/api', statsController);
  app.use('/api', encodeController);
  app.use('/api', decodeController);

  app.use(function(req, res, next) {
    res.status(404).send('Not Found');
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('error');
  });

  const server = app.listen(port, () => console.log(`Listening on ${port}`));
  return server;
};
