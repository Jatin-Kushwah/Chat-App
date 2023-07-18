const {
    userChat,
    getChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require("../controllers/chatController");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/", requireUser, userChat);
router.get("/", requireUser, getChats);
router.post("/group", requireUser, createGroupChat);
router.put("/", requireUser, renameGroup);
router.put("/add", requireUser, addToGroup);
router.delete("/", requireUser, removeFromGroup);

module.exports = router;
