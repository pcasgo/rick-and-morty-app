import { Auth } from './routes/auth';
import { Characters } from './routes/characters';
import config from '../configs/config';
import express from 'express';
import bodyParser from 'body-parser';
import { Middleware } from '../app/middleware'
const app = express();
const redis = require('redis');
const client = redis.createClient();

app.set('key', config.key);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', function (req: any, res: any) {
    res.send('Inicio');
});

app.post('/register', (req: any, res: any) => { Auth.register(req, res, client) });
app.post('/login', (req: any, res: any) => { Auth.login(req, res, client) });

const rutasProtegidas = express.Router();
rutasProtegidas.use(Middleware.secureJwt)

app.get('/characters', rutasProtegidas, Characters.getChars);

client.on('connect', function () {
    console.log('Servicio Redis conectado');
    app.listen(3000, () => {
        console.log('Servidor iniciado')
    });
});

client.on('error', function (err: any) {
    console.log('Servicio Redis no se pudo conectar ' + err);
});
