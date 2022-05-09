const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

const mysqlConnection = mysql.createConnection({
    host:'mysql',
    user:'root',
    password:'password',
    database:'cloud_stocks',
    multipleStatements:true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(8080, () => console.log('Express server is runnig at port no : 8080'));

//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Stock Exchange application." });
  });

//Get all users
app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM stock_user', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an user
app.get('/users/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM stock_user WHERE userID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an user
app.delete('/users/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM stock_user WHERE userID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an user
app.post('/users', (req, res) => {
    let usr = req.body;
    var sql = "Insert into stock_user (userID,userName,Stocks) values(?,?,?)";
    mysqlConnection.query(sql, [usr.userID, usr.userName, usr.Stocks], (err, rows, fields) => {
        if (!err)
            return res.status(200).json({message:"User added successfully"})
        else
            console.log(err);
    })
});

//Update an user
app.put('/users', (req, res) => {
    let usr = req.body;
    var sql = "SET @userID = ?;SET @userName = ?;SET @Stocks = ?; \
    CALL UserAddOrEdit(@userID,@userName,@Stocks);";
    mysqlConnection.query(sql, [usr.userID, usr.userName, usr.Stocks], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});