let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');
const verifyAndAuthorize = require('../middleware/jwt-verify-authorize');

// GET users handler
router.get('/users', (req,res) =>{
    // res.render('index.html')
    controller.getAllUsers(req, res);
});

// SignUp handler
router.post('/signup', controller.signUp);

// SignIn handler
router.post('/signin', controller.signIn);

// Sample protected route
router.put('/update-program', verifyAndAuthorize, (req, res) => {
    const userIdFromToken = req.userId;
    const userIdFromPath = req.params.userId;

    if (userIdFromPath !== userIdFromToken) {
        return res.status(403).json({ message: 'Not authorized to update progress'})
    }

    // if IDs match, process with updating
});

module.exports = router; 
