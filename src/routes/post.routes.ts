import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { validateDto } from "../middleware/validate-dto.middleware";
import { CreatePostDto } from "../dto/create-post.dto";

const router = Router();

router.post("/", validateDto(CreatePostDto), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
