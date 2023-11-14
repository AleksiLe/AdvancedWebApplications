// const http = require("http")
const express = require("express");
const os = require("os");
const path = require("path");
const app = express();
const port = 3000;

const list = []

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, "public")))

app.get("/hello", (req, res) => {
    res.send({ msg: "Hello World!" })
})

app.get("/echo/:id", (req, res) => {
    res.send({ id: req.params.id })
})

app.post("/sum", (req, res) => {
    const reqList = req.body.numbers;
    let sum = 0
    for (let i = 0; i < reqList.length; i++) {
        sum += parseInt(reqList[i])
    }
    res.send({ sum: sum })
})

app.post("/list", (req, res) => {
    list.push(req.body.data)
    res.send({ list: list })
})

app.get("/list", (req, res) => {
    res.send({ list: list })
})

app.listen(port, () => console.log(`Server listening a port ${port}!`))

console.log("Server running... fully!")

/* http.createServer(function(req,res) {
    console.log(req);
    res.write("Hello World!!");
    res.end();
    console.log("Browser reached us!")
}).listen(8000)  */
