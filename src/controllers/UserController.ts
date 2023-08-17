import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connect } from "../database/db";
import { validateUserInput } from "../util/Validation";

export const createUser = async (req: Request, res: Response) => {
  const { client, db } = await connect();

  try {
    const { name, email } = req.body;
    const validation = validateUserInput(name, email);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = {
      _id: new ObjectId(),
      name,
      email,
    };

    await db.collection("users").insertOne(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  } finally {
    client.close();
  }
};
