const router = require("express").Router();
const parcelController = require("../controllers/parcelsController");

router.post("/", parcelController.add);
router.put("/:id", parcelController.edit);

module.exports = router;
