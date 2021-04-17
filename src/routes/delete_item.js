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
  const { partNumber } = req.body;

  connection.query(
    "DELETE FROM `items` WHERE partNumber = '" + partNumber + "'",
    function (error, results) {
      if (error)
        res.json({
          success: false,
          errors: { global: "Hiba történt: " + error },
        });
      if (results[0] != undefined) {
        res.json({
          success: false,
          errors: { global: "Ez a termék már törölve lett" },
        });
      } else {
        res.json({ success: true });
      }
    }
  );
});

export default router;
