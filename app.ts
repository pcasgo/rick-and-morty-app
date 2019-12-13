import { Auth } from './src/routes/auth';
import { Characters } from './src/routes/characters';
import { Middleware } from './src/middleware'
import config from './configs/config';
import express from 'express';
import bodyParser from 'body-parser';
import redis from 'redis';
const app = express();
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
    app.listen(3500, () => {
        console.log('Servidor iniciado en puerto 3500')
    });
});

client.on('error', function (err: any) {
    console.log('Servicio Redis no se pudo conectar ' + err);
});
