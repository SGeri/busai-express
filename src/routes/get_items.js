import express from "express";
import mysql from "mysql";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
router.use(authenticate);

let connection = mysql.createConnection({
  host: "88.151.99.76",
  user: "user",
  password: "Snba1182",
  database: "test_db",
});

connection.connect();

router.post("/", (req, res) => {
  connection.query("SELECT * FROM `items`", function (error, results) {
    if (error)
      res.json({
        success: false,
        errors: { global: "Hiba történt: " + error },
      });

    res.json(results);
  });
});

export default router;
