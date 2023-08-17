import { MongoClient, Db } from "mongodb";

const dbName = "crud-typescript";
const url = `mongodb+srv://admin:admin@cluster0.6bmlj9d.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export const connect = async (): Promise<{ client: MongoClient; db: Db }> => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    console.log("MongoDB connected successfully!");
    return { client, db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
