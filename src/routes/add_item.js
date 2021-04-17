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
    "SELECT * FROM `items` WHERE barcode = '" + data.barcode + "'",
    function (error, results) {
      if (error)
        res.json({
          success: false,
          errors: { global: "Hiba történt: " + error },
        });

      if (results[0] != undefined) {
        res.json({
          success: false,
          errors: { global: "Ilyen vonalkódú termék már létezik" },
        });
      } else {
        connection.query(
          `INSERT INTO \`items\` (thumbnail, name, barcode, reorderQuantity, unit, netPurchasePrice, grossPurchasePrice, netSellPrice, grossSellPrice, vat, profitPercent, stock, supplier) VALUES ('${data.thumbnail}', '${data.name}', '${data.barcode}', '${data.reorderQuantity}', '${data.unit}', '${data.netPurchasePrice}', '${data.grossPurchasePrice}', '${data.netSellPrice}', '${data.grossSellPrice}', '${data.vat}', '${data.profitPercent}', '${data.stock}', '${data.supplier}')`,
          function (error) {
            if (error)
              res.json({
                success: false,
                errors: { global: "Hiba történt: " + error },
              });

            res.json({ success: true });
            checkStock(data.partNumber);
          }
        );
      }
    }
  );
});

export default router;
