import express from "express";
import UserRoutes from "./routes/UserRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", UserRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
