const router = require("express").Router();
const parcelController = require("../controllers/parcelsController");

router.post("/", parcelController.add);
router.put("/:id", parcelController.edit);
router.get("/", parcelController.getUnAssigned);
router.get("/", parcelController.getallUserParcels);
router.get("/filter-by-status/:status", parcelController.filterByStatus);
router.delete("/:id", parcelController.delete);

module.exports = router;
