import { Request, Response } from "express";
import Post from "../models/post.model";
import { CreatePostDto } from "../dto/create-post.dto";
import { v4 as uuidv4 } from "uuid";
import { validate } from "class-validator";

export const createPost = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const dataParse = JSON.parse(req.body);
    const createPostDto = new CreatePostDto();

    Object.assign(createPostDto, dataParse);
    const errors = await validate(createPostDto);

    if (errors.length > 0) {
      const error = errors[0].constraints;
      return res.status(400).json({ error });
    }
    const data1 = { ...dataParse, _id: id, postId: id };
    const post = await Post.create(data1);
    const data = CreatePostDto.createDtoFromEntity(post);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const data = CreatePostDto.createDtoFromEntity(post);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const count = await Post.countDocuments({});

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "Posts not found" });
    }

    const data = CreatePostDto.createDtosFromEntities(posts);
    res.status(200).json({ count, data, page, limit });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dataParse = JSON.parse(req.body);
    const createPostDto = new CreatePostDto();

    Object.assign(createPostDto, dataParse);
    const errors = await validate(createPostDto);

    if (errors.length > 0) {
      const error = errors[0].constraints;
      return res.status(400).json({ error });
    }
    const post = await Post.findByIdAndUpdate(id, dataParse);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatedPost = await Post.findById(id);
    const data = CreatePostDto.createDtoFromEntity(updatedPost);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: !!post });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
