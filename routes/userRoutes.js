const router = require("express").Router();
const userController = require("../controllers/userController");

router.put("/:id", userController.updateUser);
router.get("/", userController.getCurrentUser);

module.exports = router;
