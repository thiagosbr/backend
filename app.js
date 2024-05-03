var express = require("express");
var multer = require("multer");
var csvParser = require("csv-parser");
var fs = require("fs");
var cors = require("cors");
var app = express();
// Habilita o CORS para permitir requisições de outras origens
app.use(cors());
// Configuração do multer para fazer upload de arquivos para a pasta 'uploads'
var upload = multer({ dest: "uploads/" });
// Rota para renderizar o formulário de upload de arquivos

var results = [];
app.get('/', function (req, res) {
    res.send('API Node está funcionando corretamente!!!!');
});
//
app.get("/api/reset", function (req, res) {
    results = [];
    res.json(results);
});
// Rota para lidar com o upload de arquivos CSV
app.post("/api/files", upload.single("csv"), function (req, res) {
    if (!req.file) {
        return res.status(400).send("No file selected");
    }
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", function (data) { return results.push(data); })
        .on("end", function () {
        res.json(results);
    });
});
app.get("/api/users", function (req, res) {
    var params = req.query;
    if (!params.q) {
        return res.json(results);
    }
    var data = results.filter(function (result) {
        return (result.name.toLowerCase().includes(params.q.toLowerCase()) ||
            result.city.toLowerCase().includes(params.q.toLowerCase()) ||
            result.country.toLowerCase().includes(params.q.toLowerCase()) ||
            result.favorite_sport.toLowerCase().includes(params.q.toLowerCase()));
    });
    res.json(data);
});
// Inicia o servidor
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Servidor rodando em http://localhost:".concat(PORT));
});
