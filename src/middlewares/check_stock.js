import mysql from "mysql";
import { GoogleSpreadsheet } from "google-spreadsheet";

// mysql init
let connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "busai_warehouse",
});

connection.connect();

// sheet init
import credentials from "../../prod-credentials.json";

const doc = new GoogleSpreadsheet(
  "1QJMZmg4ujrkrPKIK17AD2yXP0ufC5HmmNYp50xVKgrY"
);

async function setupSheets() {
  await doc.useServiceAccountAuth(credentials);

  await doc.loadInfo();
  doc.updateProperties({ title: "Beszerzési táblázatok" });
}

setupSheets();

export default function checkStock(partNumber) {
  connection.query("SELECT * FROM `items`", function (error, items) {
    if (error) return;

    items.forEach(async (item) => {
      if (item.partNumber != partNumber) return;

      const sheet = await doc.sheetsByTitle[item.supplier];
      const rows = await sheet.getRows();

      if (item.reorderQuantity > item.stock) {
        if (rows.length <= 0) {
          await sheet.addRow({
            Azonosító: item.partNumber,
            "Termék kép": item.thumbnail,
            "Termék neve": item.name,
            "Rendelési mennyiség":
              item.reorderQuantity - item.stock + " " + item.unit,
          });
        } else {
          rows.forEach(async (row, index) => {
            if (row._rawData && parseInt(row._rawData[0]) == partNumber) {
              row["Rendelési mennyiség"] =
                item.reorderQuantity - item.stock + " " + item.unit;
              row.save();
            } else if (index + 1 == rows.length) {
              await sheet.addRow({
                Azonosító: item.partNumber,
                "Termék kép": item.thumbnail,
                "Termék neve": item.name,
                "Rendelési mennyiség":
                  item.reorderQuantity - item.stock + " " + item.unit,
              });
            }
          });
        }
      } else {
        rows.forEach(async (row, index) => {
          if (row._rawData && parseInt(row._rawData[0]) == partNumber) {
            await rows[index].delete();
          }
        });
      }
    });
  });
}
