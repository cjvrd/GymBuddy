let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');

// GET users handler
router.get('/', (req, res) => {
    controller.getAllUsers(req, res);
});

// POST user handler for signup
router.post('/signup', function(req, res) {
    controller.postUser(req, res);
});

// POST user handler for login
router.post('/login', function(req, res) {
    controller.loginUser(req, res);
});



module.exports = router;