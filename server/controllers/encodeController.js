import express from 'express';

import urlModelSetup from '../models/urlModel';

const router = express.Router();
const model = urlModelSetup();

router.post('/save', (req, res) => {
  const {url} = req.body;
  if(!url) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.saveUrl(url, (v) => {
    // error handling for null value is missing
    res.status(200).json({
      key: v,
      shortUrl: `http://localhost:3100/${v}`
    });
  });
});

/*
router.get('/saveUrl/:url', ({url}, res) => {
  if(!url) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.saveUrl(url, (v) => {
    res.status(200).send(v);
  });
});
*/

export default router;
