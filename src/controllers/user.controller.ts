import { Request, Response } from "express";
import User from "../models/user.model";
import { CreateUserDto } from "../dto/user.dto";
import { validate } from "class-validator";
import hashPassword from "./auth.controller";
export const createUser = async (req: Request, res: Response) => {
  try {
    const dataParse = JSON.parse(req.body);
    const createUserDto = new CreateUserDto();

    Object.assign(createUserDto, dataParse);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      const error = errors[0].constraints;
      return res.status(400).json({ error });
    }

    const existsUser = await User.findOne({ email: createUserDto.email });
    if (existsUser) {
      return res
        .status(404)
        .json({ message: "This user email already exists" });
    }
    const hashedPassword = hashPassword(createUserDto.password);
    const newUser = new User({ ...createUserDto, password: hashedPassword });
    const savedUser = await newUser.save();
    const data = CreateUserDto.createDtoFromEntity(savedUser);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const data = CreateUserDto.createDtoFromEntity(user);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const count = await User.countDocuments({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    const data = CreateUserDto.createDtosFromEntities(users);

    res.status(200).json({ count, data, page, limit });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const dataParse = JSON.parse(req.body);
  const createUserDto = new CreateUserDto();

  Object.assign(createUserDto, dataParse);
  const errors = await validate(createUserDto);

  if (errors.length > 0) {
    const error = errors[0].constraints;
    return res.status(400).json({ error });
  }
  try {
    const { id } = req.params;

    if (createUserDto.password) {
      createUserDto.password = hashPassword(createUserDto.password);
    }
    const user = await User.findByIdAndUpdate(id, createUserDto);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);

    const data = CreateUserDto.createDtoFromEntity(updatedUser);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: !!user });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
