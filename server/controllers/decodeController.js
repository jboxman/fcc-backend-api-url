import express from 'express';

import urlModelSetup from '../models/urlModel';

const router = express.Router();
const model = urlModelSetup();

router.param('key', (req, res, next, key) => {
  if(key)
    req.key = key;
  next();
});

router.get('/fetch/:key', ({key}, res) => {
  if(!key) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.getUrl(key, (v) => {
    res.status(200).json({
      url: v
    });
  });
});

export default router;
