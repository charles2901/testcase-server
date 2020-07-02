const router = require("express").Router();
const parentController = require("../controllers/parentController");
const { authenticationParent } = require("../middlewares/authentication");
const { authorizationUpdateParent } = require("../middlewares/authorization");

router.post("/register", parentController.registerParent);
router.post("/login", parentController.loginParent);
router.get("/", parentController.getAllParents);
// router.get("/allchildren", parentController.getAllChildren);
router.get("/:id", parentController.getParentById);
router.use(authenticationParent);
router.put(
  "/:id",
  parentController.updateDataParent
);
router.delete("/:id", parentController.deleteById);

module.exports = router;
