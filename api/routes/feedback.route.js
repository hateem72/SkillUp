import express from "express";
import { saveFeedback, getUserFeedback , deleteFeedback} from "../controllers/feedback.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, saveFeedback);
router.get("/", verifyToken, getUserFeedback);
router.delete("/:id", verifyToken,deleteFeedback);

export default router;