const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kebonematimela'
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post("/api/register", (req,res)=>{


    const fullname = req.body.fullname;
    const email = req.body.email;
    const mark = req.body.mark;
    const password= req.body.password;
    const city=req.body.city;
    const phone=req.body.phone;
    const id_number=req.body.id_number;

    const sqlInsert = "INSERT INTO users (fullname,email,mark,password,city,phone,id_number) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlInsert,[fullname,email,mark,password,city,phone,id_number], (err,result)=>{
        console.log(err);
    })
})


app.listen(3002, ()=>{
    
})