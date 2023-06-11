const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send("Hello World");
});

router.get('/test(.html)?', (req, res) => {
    res.send("you test me !!!");
})

module.exports = router;