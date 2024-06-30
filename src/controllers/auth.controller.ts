import { Request, Response } from "express";
import crypto from "crypto";

import User from "../models/user.model";
import { CreateUserDto, LoginUserDto } from "../dto/user.dto";
import { validate } from "class-validator";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = (password: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};
export default hashPassword;

const generateToken = (user: any): string => {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const payload = Buffer.from(JSON.stringify({ id: user._id })).toString(
    "base64"
  );
  const data = `${header}.${payload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64");

  return `${data}.${signature}`;
};

export const signup = async (req: Request, res: Response) => {
  const createUserDto = new CreateUserDto();
  Object.assign(createUserDto, JSON.parse(req.body));

  const errors = await validate(createUserDto);
  if (errors.length > 0) {
    const error = errors[0].constraints;
    return res.status(400).json({ error });
  }

  const existingUser = await User.findOne({ email: createUserDto.email });
  if (existingUser) {
    return res.status(404).json({ message: "This user email already exists" });
  }

  try {
    const hashedPassword = hashPassword(createUserDto.password);
    const newUser = new User({ ...createUserDto, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = generateToken(savedUser);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const loginUserDto = new LoginUserDto();
  Object.assign(loginUserDto, JSON.parse(req.body));

  const errors = await validate(loginUserDto);
  if (errors.length > 0) {
    const error = errors[0].constraints;
    return res.status(400).json({ error });
  }

  try {
    const user = await User.findOne({ email: loginUserDto.email });

    if (!user || user.password !== hashPassword(loginUserDto.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
