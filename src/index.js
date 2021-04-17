import express from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

import auth from "./routes/auth";
import get_items from "./routes/get_items";
import add_item from "./routes/add_item";
import edit_item from "./routes/edit_item";
import delete_item from "./routes/delete_item";
import adjust_stock from "./routes/adjust_stock";

app.use("/api/auth", auth);
app.use("/api/get_items", get_items);
app.use("/api/add_item", add_item);
app.use("/api/edit_item", edit_item);
app.use("/api/delete_item", delete_item);
app.use("/api/adjust_stock", adjust_stock);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(4000, () => {
  console.log("Server running on localhost:4000");
});
