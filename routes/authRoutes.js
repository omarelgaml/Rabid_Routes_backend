const router = require("express").Router();
const authControllder = require("../controllers/authController");
//const authCheck = require('../middlewares/auth');

// router.get('/login', authControllder.login);
router.post("/register", authControllder.signup);
// router.post('/refresh-token', authControllder.refreshToken);
// router.post('/logout', authCheck, authControllder.logout);
// router.post('/send-reset-password-email', authControllder.sendResPassEmail);
// router.put('/reset-password', authControllder.reSetPassword);

module.exports = router;
