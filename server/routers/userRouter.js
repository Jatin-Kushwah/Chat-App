const router = require("express").Router();
const {
    searchUser,
    getMYInfo,
    updateMyInfo,
    getAllUsers,
} = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

router.get("/", requireUser, searchUser);
router.get("/getAllUsers", requireUser, getAllUsers);
router.get("/myInfo", requireUser, getMYInfo);
router.post("/", requireUser, updateMyInfo);

module.exports = router;
