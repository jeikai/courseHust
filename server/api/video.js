const express = require('express');
const api = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;
const proxy = require('../middlewares/proxyMiddleware');

api.post('/video', use(videoController.convert));
api.use('/proxy', proxy);

module.exports = api;
