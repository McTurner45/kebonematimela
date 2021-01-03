const useEffect = require("react");
const  useState = require("react");
const Axios = require("axios");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "kebonematimela",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/lost_livestock", (req, res) => {
  const sqlSelect = "SELECT * FROM lost_livestock WHERE status!='missing'";

  db.query(sqlSelect, (err, result) => {
      res.send(result);
    console.log(err);
  });
});

app.post("/api/report/missing", (req, res) => {
  const age = req.body.age;
  const colour = req.body.colour;
  const kind = req.body.kind;
  const brand = req.body.brand;
  const breed = req.body.breed;
  const size = req.body.size;

  const sqlInsert =
    "INSERT INTO lost_livestock " +
      "(age,colour,kind,brand,breed,weight) " +
      "VALUES (?,?,?,?,?,?);";
  db.query(
    sqlInsert,
    [age, colour, kind, brand, breed, size],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/api/report/found/brand",
    (req,res)=>{
  const brand = req.body.brand;
  const colour = req.body.colour;
  const kind = req.body.kind;
  const breed = req.body.breed;

  const sqlUpdate="UPDATE lost_livestock SET status " +
      "= ? WHERE brand==? colour==? kind==? breed==?";

  db.query(sqlUpdate,["found",brand, colour, kind, breed],(err, results)=>{
    console.log(results);
  });
})

app.post("/api/report/found/not_in_db",
    (req, res) => {

  const colour = req.body.colour;
  const kind = req.body.kind;
  const brand = req.body.brand;
  const breed = req.body.breed;
  const status= req.body.status;
  const age= 'unknown';
  const weight= 0;

    const sqlInsert =
        "INSERT INTO lost_livestock " +
        "(age,colour,kind,brand,breed,weight,status) " +
        "VALUES ('"+age+"',?,?,?,?,'"+weight+"',?);";
    db.query(
        sqlInsert,
        [ colour, kind, brand, breed, status],
        (err, result) => {
          console.log(err);
          console.log(result);
        }
    );


});

app.post("/api/register", (req, res) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const mark = req.body.mark;
  const password = req.body.password;
  const city = req.body.city;
  const phone = req.body.phone;
  const id_number = req.body.id_number;

  const sqlInsert =
    "INSERT INTO users (fullname,email,mark,password,city,phone,id_number) VALUES (?,?,?,?,?,?,?);";
  db.query(
    sqlInsert,
    [fullname, email, mark, password, city, phone, id_number],
    (err, result) => {
      console.log(err);
    }
  );
});

app.listen(3002, () => {});
