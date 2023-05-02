const router = require("express").Router();
const parcelController = require("../controllers/parcelsController");

router.post("/", parcelController.add);
router.put("/:id", parcelController.edit);
router.get("/", parcelController.getAll);
router.get("/filter", parcelController.filterByStatus);

module.exports = router;
