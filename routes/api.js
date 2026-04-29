const router = require('express').Router();

router.use('/games', require('./games'));
router.use('/favorites', require('./favorites'));

module.exports = router;
