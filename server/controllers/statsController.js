import express from 'express';

import urlModelSetup from '../models/urlModel';

const router = express.Router();
const model = urlModelSetup();

router.get('/recent', (req, res) => {
  model.getRecent(v => {
    res.status(200).json({
      recentUrls: v
    });
  });
});

export default router;
