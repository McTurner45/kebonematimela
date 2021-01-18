const useEffect = require("react");
const useState = require("react");
const Axios = require("axios");
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require('cors')


const saltRounds = 10;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "kebonematimela",
});

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000/"],
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    method: ["GET", "POST"],
    credential: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
    key: "userId",
    secret: "matimela_a_botswana",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))

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
            req.session.user = result
            console.log(err);
        }
    );
});

app.get("/api/login", ((req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});

    }
}))

app.get("/api/logout", ((req, res) => {
    res.send({loggedIn: false})
}))

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
                req.session.user = result
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

app.listen(3002, () => {
});
