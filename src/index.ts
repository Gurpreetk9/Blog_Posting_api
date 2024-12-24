import express from "express";
import mongoose from "mongoose";
import routes from "./routes/post";
import "dotenv/config";

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database");
});

app.use("/posts", routes);

app.listen(3000, () => {
  console.log("Server is listening atport 3000");
});
