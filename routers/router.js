let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');

// GET users handler
router.get('/', (req,res) =>{
    // res.render('index.html')
    controller.getAllUsers(req, res);
})

// POST user handler
router.post('/', function(req, res){
    controller.postUser(req, res);
})

module.exports = router;