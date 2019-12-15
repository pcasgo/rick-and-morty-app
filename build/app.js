"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./src/routes/auth");
var characters_1 = require("./src/routes/characters");
var middleware_1 = require("./src/middleware");
var config_1 = __importDefault(require("./configs/config"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var redis_1 = __importDefault(require("redis"));
var app = express_1.default();
var client = redis_1.default.createClient(6379, 'localhost');
app.set('key', config_1.default.key);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', function (req, res) {
    res.send('Inicio');
});
app.post('/register', function (req, res) { auth_1.Auth.register(req, res, client); });
app.post('/login', function (req, res) { auth_1.Auth.login(req, res, client); });
var rutasProtegidas = express_1.default.Router();
rutasProtegidas.use(middleware_1.Middleware.secureJwt);
app.get('/characters', rutasProtegidas, characters_1.Characters.getChars);
client.on('connect', function () {
    console.log('Servicio Redis conectado');
    app.listen(3500, function () {
        console.log('Servidor iniciado en puerto 3500');
    });
});
client.on('error', function (err) {
    console.log('Servicio Redis no se pudo conectar ' + err);
});
