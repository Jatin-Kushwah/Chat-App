const {
    sendMessage,
    getAllMessages,
} = require("../controllers/messageController");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/", requireUser, sendMessage);
router.get("/:chatId", requireUser, getAllMessages);

module.exports = router;
