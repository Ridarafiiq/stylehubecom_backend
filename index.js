const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const sql = require("mssql");
var mysql = require('mysql');
const app = express();

app.use(cors());


var router = express.Router();
app.use("/", router);
router.get( "/",
  async (req, res, next) => {
    res.send("Welcome to Style Hub APIs");
  }
);

// user: SQL_USER,
// password: SQL_PASSWORD,
// const sqlInfo = {
//     sql: {
//         server: 'localhost',
//         database: 'ReactProducts',
//         user:'sa',
//         password:'root',
//         options: {
//             encrypt: false,
//         },
//     },
// };

const sqlInfo = {
  mysql: {
      host: '54.164.166.238',
      port: '3306',
      database: 'ReactProducts',
      user: 'rida',
      password: 'rida@123',
  },
};





// Default Route

// router.get(
//     "/:table",
//     async (req, res, next) => {
//       let pool = await sql.connect(sqlInfo.sql);

//       var Result;
//       try {
//         switch (req.params.table.toLowerCase()) {
//           case "products":
//             Result = await pool.request()
//             .query("SELECT * FROM products");


//            let result = await Promise.all(
//               Result.recordset.map(async(item)=>{
//                 let images = await pool.request()
//                  .query("SELECT url FROM image where prd_id = " + item.id );
//                  item.images=[];
//                  let imagesFormat = images.recordset?.map((ele)=>{
//                    return ele?.url;
//                  }) ?? [];
//                  item["images"] = imagesFormat;
//                  return item;
//                })
//             );

//            res.send(result);
//             break;
//           default: {
//             Result = await pool.request()
//               .query("SELECT * FROM products JOIN image ON products.id = image.prd_id");
//             res.send(Result.recordset);
//           }
//         }
//       } catch (ex) {
//         res.send(ex);
//       }
//     }
//   );


// Default Route

router.get(
  "/:table",
  async (req, res, next) => {
    let connection = mysql.createConnection({
      host: '172.17.0.1',
      port: '3306',
      database: 'ReactProducts',
      user: 'rida',
      password: 'rida@123',
    });

    connection.connect();

    var Result;

    try {
      switch (req.params.table.toLowerCase()) {
        case "products":
          Result = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM products", (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });

          let result = await Promise.all(
            Result.map(async (item) => {
              let images = await new Promise((resolve, reject) => {
                connection.query("SELECT url FROM image where prd_id = ?", [item.id], (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results);
                  }
                });
              });

              item.images = images.map((ele) => ele.url);
              return item;
            })
          );

          res.send(result);
          break;
        default: {
          Result = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM products JOIN image ON products.id = image.prd_id", (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          });

          res.send(Result);
        }
      }
    } catch (ex) {
      res.send(ex);
    }

    connection.end(); // Close the connection after using it
  }
);



app.use(express.json());
app.use(bodyParser.json());


app.listen(5000, "0.0.0.0", () => {
  console.log("app listening on url http://localhost:5000");
});
