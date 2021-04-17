import express from "express";
import mysql from "mysql";
import checkStock from "../middlewares/check_stock";
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
  const { data, isSelling } = req.body;

  data.forEach((e) => {
    if (isSelling) {
      let newStock = e.stock - e.adjust;

      if (newStock < 0) {
        res.json({
          success: false,
          errors: { global: "Ebből a termékből nincs elég" },
        });
      } else {
        connection.query(
          `UPDATE \`items\` SET stock = '${newStock}' WHERE partNumber = '${e.partNumber}'`,
          function (error) {
            if (error)
              res.json({
                success: false,
                errors: { global: "Hiba történt: " + error },
              });

            res.json({
              success: true,
            });

            checkStock(e.partNumber);
          }
        );
      }
    } else {
      let newStock = e.stock + e.adjust;

      if (newStock < 0) {
        res.json({
          success: false,
          errors: {
            global: "Bevételezéskor nem csökkenhet a termék mennyisége",
          },
        });
      } else {
        connection.query(
          `UPDATE \`items\` SET stock = '${newStock}' WHERE partNumber = '${e.partNumber}'`,
          function (error) {
            if (error)
              res.json({
                success: false,
                errors: { global: "Hiba történt: " + error },
              });

            res.json({
              success: true,
            });

            checkStock(e.partNumber);
          }
        );
      }
    }
  });
});

export default router;
