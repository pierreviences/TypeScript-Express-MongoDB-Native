import { ObjectId } from "mongodb";

interface User {
  _id: ObjectId;
  name: string;
  email: string;
}

export default User;
