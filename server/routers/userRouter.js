const router = require("express").Router();
const { searchUser, getMYInfo } = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

router.get("/", requireUser, searchUser);
router.get("/myInfo", requireUser, getMYInfo);

module.exports = router;
