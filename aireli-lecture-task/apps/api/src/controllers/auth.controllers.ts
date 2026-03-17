import { Request, Response } from 'express';
import { PlatformUserCreateInput } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  const newUser: PlatformUserCreateInput = {
    email,
    password,
  };

  try {
    const createdUser = await createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT'
    ) {
      res.status(409).json({ message: 'A user with this email already exists.' });
      return;
    }

    console.error('Failed to register user:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
};
