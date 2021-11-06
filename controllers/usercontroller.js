const Express = require("express");
const router = Express.Router();

router.get('/practice', (req, res) => {
    res.send("Hey, this is a practice route for user controller!")
});

module.exports = router;