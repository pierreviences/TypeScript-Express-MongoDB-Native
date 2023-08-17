import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connect } from "../database/db";
import { validateUserInput } from "../util/Validation";
import User from "../models/User";

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

    const newUser: User = {
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

export const getUsers = async (req: Request, res: Response) => {
  const { client, db } = await connect();

  try {
    const users = await db.collection("users").find().toArray();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  } finally {
    client.close();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { client, db } = await connect();

  try {
    const { name, email } = req.body;
    const userId = new ObjectId(req.params.id);
    const validation = validateUserInput(name, email);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const existingUserWithEmail = await db
      .collection("users")
      .findOne({ email });
    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== userId.toString()
    ) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const updatedUser = await db
      .collection("users")
      .findOneAndUpdate({ _id: userId }, { $set: { name, email } });

    if (!updatedUser.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  } finally {
    client.close();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { client, db } = await connect();

  try {
    const userId = new ObjectId(req.params.id);

    const deletedUser = await db
      .collection("users")
      .findOneAndDelete({ _id: userId });

    if (!deletedUser.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  } finally {
    client.close();
  }
};
