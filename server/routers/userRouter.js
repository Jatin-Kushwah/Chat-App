const router = require("express").Router();
const { searchUser } = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

router.get("/", requireUser, searchUser);

module.exports = router;
