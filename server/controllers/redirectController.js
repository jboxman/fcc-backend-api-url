import express from 'express';

import urlModelSetup from '../models/urlModel';

const router = express.Router();
const model = urlModelSetup();

// Perform validation
router.param('key', (req, res, next, key) => {
  console.log(key);
  if(key)
    req.key = key;
  next();
});

router.get('/:key', ({key}, res) => {
  if(!key) {
    res.status(404).send('Not Found');
    return;
  }
  model.getUrl(key, (v) => {
    // Add null handling
    res.redirect(v);
  });
});

export default router;
