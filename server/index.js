const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require('cors');


const db = mysql.createPool({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b0c05b9a8213c1",
    password: "074e2c7b",
    database: "heroku_46d8155810b5c82",
});


const app = express();
app.use(express.json());

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    // For legacy browser support
    methods: "GET, POST",
    credentials: true,
}

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('origin') );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//getting data from the database
app.get("/api/found_livestock", (req, res) => {
    const sqlSelect = "SELECT * FROM lost_livestock WHERE status!='missing'";

    db.query(sqlSelect, (err, result) => {
        res.send(result);
        console.log(err);
    });
});

app.get("/api/get_all_lost_livestock", (req, res) => {
    const sqlSelect = "SELECT * FROM lost_livestock WHERE status='missing'";

    db.query(sqlSelect, (err, result) => {
        res.send(result);
        console.log(err);
    });
});

app.get("/api/get_all_livestock", (req, res) => {
    const sqlSelect = "SELECT * FROM lost_livestock";

    db.query(sqlSelect, (err, result) => {
        res.send(result);
        console.log(err);
    });
});

//sending data to the database
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
    (req, res) => {
        const brand = req.body.brand;
        const colour = req.body.colour;
        const kind = req.body.kind;
        const breed = req.body.breed;
        const zone = req.body.zone;

        const sqlUpdate = "UPDATE lost_livestock SET status " +
            "= ? WHERE brand==? colour==? kind==? breed==? zone==?";

        db.query(sqlUpdate, ["found", brand, colour, kind, breed, zone], (err, results) => {
            console.log(results);
        });
    })

app.post("/api/report/found/not_in_db",
    (req, res) => {

        const colour = req.body.colour;
        const kind = req.body.kind;
        const brand = req.body.brand;
        const breed = req.body.breed;
        const status = req.body.status;
        const zone = req.body.zone;

        const age = 'unknown';
        const weight = 0;

        const sqlInsert =
            "INSERT INTO lost_livestock " +
            "(age,colour,kind,brand,breed,weight,status,zone) " +
            "VALUES ('" + age + "',?,?,?,?,'" + weight + "',?,?);";
        db.query(
            sqlInsert,
            [colour, kind, brand, breed, status, zone],
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

app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlInsert =
        "SELECT * FROM users WHERE email=? AND password=?";
    db.query(
        sqlInsert,
        [email, password],
        (err, result) => {
            if (err) {
                res.send({err: err})
            }
            if (result.length > 0) {
                res.send(result)
            } else {
                res.send({message: "wrong email/password combination"})
            }

        }
    );
});

{
    //Importatnt Sql Queries

    const createSchema = "CREATE DATABASE`kebonematimela`";
    const createUserTable =
        "CREATE TABLE `kebonematimela`.`users` (\n" +
        "  `idUsers` INT NOT NULL,\n" +
        "  `fullname` VARCHAR(45) NULL,\n" +
        "  `email` VARCHAR(45) NULL,\n" +
        "  `mark` VARCHAR(45) NULL,\n" +
        "  `password` VARCHAR(45) NULL,\n" +
        "  `phone` INT NULL,\n" +
        "  `id_number` INT NULL,\n" +
        "  PRIMARY KEY (`idUsers`));\n"

    const createAnimalTable =
        "CREATE TABLE `kebonematimela`.`lost_livestock` (\n" +
        "  `idlost_livestock` INT NOT NULL,\n" +
        "  `age` VARCHAR(45) NULL,\n" +
        "  `lost_livestockcol` VARCHAR(45) NULL,\n" +
        "  `colour` VARCHAR(45) NULL,\n" +
        "  `kind` VARCHAR(45) NULL,\n" +
        "  `brand` VARCHAR(45) NULL,\n" +
        "  `weight` VARCHAR(45) NULL,\n" +
        "  `zone` VARCHAR(45) NULL,\n" +
        "  `status` VARCHAR(45) NULL,\n" +
        "  PRIMARY KEY (`idlost_livestock`));\n"
}

let PORT=3002;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});