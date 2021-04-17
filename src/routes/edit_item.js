import express from "express";
import mysql from "mysql";
import authenticate from "../middlewares/authenticate";

import checkStock from "../middlewares/check_stock";

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
  const { data } = req.body;

  connection.query(
    "SELECT * FROM `items` WHERE partNumber = '" + data.partNumber + "'",
    function (error, results) {
      if (error)
        res.json({
          success: false,
          errors: { global: "Hiba történt: " + error },
        });

      if (results[0] == undefined) {
        res.json({
          success: false,
          errors: { global: "Ilyen vonalkódú termék már létezik" },
        });
      } else {
        connection.query(
          `UPDATE \`items\` SET thumbnail = '${data.thumbnail}', name = '${data.name}', barcode = '${data.barcode}', reorderQuantity = '${data.reorderQuantity}', unit = '${data.unit}', netPurchasePrice = '${data.netPurchasePrice}', grossPurchasePrice = '${data.grossPurchasePrice}', netSellPrice = '${data.netSellPrice}', grossSellPrice = '${data.grossSellPrice}', vat = '${data.vat}', profitPercent = '${data.profitPercent}', stock = '${data.stock}', supplier = '${data.supplier}' WHERE partNumber = '${data.originalPartNumber}'`,
          function (error) {
            if (error)
              res.json({
                success: false,
                errors: { global: "Hiba történt: " + error },
              });

            res.json({
              success: true,
            });

            checkStock(data.originalPartNumber);
          }
        );
      }
    }
  );
});

export default router;
