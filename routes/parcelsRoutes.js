const router = require("express").Router();
const parcelController = require("../controllers/parcelsController");

router.post("/", parcelController.add);
router.put("/:id", parcelController.edit);
router.get("/", parcelController.getUnAssigned); // for bikers
router.get("/sender", parcelController.getallUserParcels); // for senders
router.get("/filter-by-status/:status", parcelController.filterByStatus);
router.delete("/:id", parcelController.delete);
router.get("/statuses", parcelController.getStatuses);

module.exports = router;
