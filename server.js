const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello Backend ");
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "23042541",
  database: "db_64102080",
});

db.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
    return;
  }
  console.log("MySQL connected");
});

app.post("/getPromotions", (req, res) => {
  let message = "";
  let results = "";
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    message = "Username or Password not present";
    res.status(400).send({
      error: false,
      data: results,
      msg: message,
    });
  } else {
    db.query(
      "SELECT * FROM user_login WHERE username = ? and password = ?",
      [username, password],
      function (err, results) {
        if (err) console.log(err);
        if (results.length == 0 || results === undefined) {
          message = "Username or Password is wrong";
          res.status(400).send({
            error: false,
            data: results,
            msg: message,
          });
        } else {
          // Login successful, update the activeFlag to 1
          db.query(
            "UPDATE user_login SET activeFlag = 1 WHERE username = ?",
            [username],
            function (err, results) {
              if (err) console.log(err);
              db.query(
                "SELECT * FROM promotion order by id",
                (error, results, fields) => {
                  if (error) console.log(error);
                  if (results.length == 0 || results === undefined)
                    message = "Table branch is empty !";
                  else {
                    message = "Get receipt successfully.";
                    res.status(200).send({
                      error: false,
                      data: results,
                      msg: message,
                    });
                  }
                }
              );
            }
          );
        }
      }
    );
  }
});

app.post("/deletePromotion/:id", (req, res) => {
  let message = "";
  let results = "";
  console.log(req.params);
  const { username, password } = req.body;

  if (!username || !password) {
    message = "Username or Password not present";
    res.status(400).send({
      error: false,
      data: results,
      msg: message,
    });
  } else {
    db.query(
      "SELECT * FROM user_login WHERE username = ? and password = ?",
      [username, password],
      function (err, results) {
        if (err) console.log(err);
        if (results.length == 0 || results === undefined) {
          message = "Username or Password is wrong";
          res.status(400).send({
            error: false,
            data: {},
            msg: message,
          });
        } else {
          if (results[0].authority == 0) {
            db.query(
              "DELETE FROM promotion WHERE id = ?",
              [req.params.id],
              (error, results) => {
                if (error) {
                  console.error("MySQL query error:", error);
                  res.status(500).send({
                    error: true,
                    data: null,
                    msg: "Internal Server Error",
                  });
                } else if (results.affectedRows == 0) {
                  const errorMessage = "User not found";
                  res.status(404).send({
                    error: false,
                    data: null,
                    msg: errorMessage,
                  });
                } else {
                  // const successMessage = `User with ID ${req.params.id} deleted successfully`;
                  const successMessage = "deleted";
                  res.status(200).send({
                    error: false,
                    data: results,
                    msg: successMessage,
                  });
                }
              }
            );
          } else {
            message = "User not have permistion to delete Promotion";
            res.status(400).send({
              error: false,
              data: {},
              msg: message,
            });
          }
        }
      }
    );
  }
});

app.post("/getPromoByID/:id", (req, res) => {
  let id = req.params.id;
  let message = "";
  let results = "";
  const { username, password } = req.body;
  if (!username || !password) {
    message = "Username or Password not present";
    res.status(400).send({
      error: false,
      data: results,
      msg: message,
    });
  } else {
    db.query(
      "SELECT * FROM user_login WHERE username = ? and password = ?",
      [username, password],
      function (err, results) {
        if (err) console.log(err);
        if (results.length == 0 || results === undefined) {
          message = "Username or Password is wrong";
          res.status(400).send({
            error: false,
            data: results,
            msg: message,
          });
        } else {
          results;
          db.query(
            "SELECT * FROM promotion WHERE id = ?",
            [id],
            function (err, results) {
              if (err) console.log(err);

              if (results.length == 0 || results === undefined) {
                message = "Not have user";
              } else {
                message = "Selected";
              }
              res.status(200).send({
                error: false,
                data: results,
                msg: message,
              });
            }
          );
        }
      }
    );
  }
});

app.post("/insertPromotion", (req, res) => {
  let message = "";
  let results = "";
  const { username, password } = req.body;
  let object = req.body;
  if (!username || !password) {
    message = "Username or Password not present";
    res.status(400).send({
      error: false,
      data: results,
      msg: message,
    });
  } else {
    db.query(
      "SELECT * FROM user_login WHERE username = ? and password = ?",
      [username, password],
      function (err, results) {
        if (err) console.log(err);
        if (results.length == 0 || results === undefined) {
          message = "Username or Password is wrong";
          res.status(400).send({
            error: false,
            data: {},
            msg: message,
          });
        } else {
          if (results[0].authority == 0) {
            db.query(
              "INSERT INTO promotion (Code_Promotion, Descriptions, Discount, Total, Partner, Start_date, End_date) VALUES (?,?,?,?,?,?,?)",
              [
                object.Code_Promotion,
                object.Descriptions,
                object.Discount,
                object.Total,
                object.Partner,
                object.Start_date,
                object.End_date,
              ],
              function (err, results) {
                if (err) console.log(err);
                // console.log(results);
                if (results) {
                  message = "inserted";
                } else {
                  message = "CannotInsert";
                }
                res.status(200).send({
                  error: false,
                  data: results,
                  msg: message,
                });
              }
            );
          } else {
            message = "User not have permistion to create Promotion";
            res.status(400).send({
              error: false,
              data: {},
              msg: message,
            });
          }
        }
      }
    );
  }
});

app.put("/updatePromotion/:id", (req, res) => {
  let message = "";
  let results = "";
  let id = req.params.id;
  const { username, password } = req.body;
  let object = req.body;
  if (!username || !password) {
    message = "Username or Password not present";
    res.status(400).send({
      error: false,
      data: results,
      msg: message,
    });
  } else {
    db.query(
      "SELECT * FROM user_login WHERE username = ? and password = ?",
      [username, password],
      function (err, results) {
        if (err) console.log(err);
        if (results.length == 0 || results === undefined) {
          message = "Username or Password is wrong";
          res.status(400).send({
            error: false,
            data: {},
            msg: message,
          });
        } else {
          if (results[0].authority == 0) {
            let sql =
              "UPDATE promotion SET Code_Promotion=?, Descriptions=?, Discount=?, Total=?, Partner=?, Start_date=?, End_date=? WHERE id=?";

            db.query(
              sql,

              [
                object.Code_Promotion,
                object.Descriptions,
                object.Discount,
                object.Total,
                object.Partner,
                object.Start_date,
                object.End_date,
                id,
              ],
              function (err, results) {
                if (err) console.log(err);
                // console.log(results);
                if (results) {
                  message = "inserted";
                } else {
                  message = "CannotInsert";
                }
                res.status(200).send({
                  error: false,
                  data: results,
                  msg: message,
                });
              }
            );
          } else {
            message = "User not have permistion to update Promotion";
            res.status(400).send({
              error: false,
              data: {},
              msg: message,
            });
          }
        }
      }
    );
  }
});
