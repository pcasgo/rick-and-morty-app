import { Auth } from './src/routes/auth';
import { Characters } from './src/routes/characters';
import { Middleware } from './src/middleware'
import config from './configs/config';
import express from 'express';
import redis from 'redis';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

const app = express();
const client = redis.createClient(6379, 'localhost');

// Settings
app.set('port', process.env.PORT || 3500);
app.set('key', config.key);

// Middleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
const rutasProtegidas = express.Router();
rutasProtegidas.use(Middleware.secureJwt)

// Static 
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Routes
app.get('/characters', rutasProtegidas, Characters.getChars);
app.post('/register', (req: any, res: any) => { Auth.register(req, res, client) });
app.post('/login', (req: any, res: any) => { Auth.login(req, res, client) });

// Start server
client.on('connect', function () {
    console.log('Servicio Redis conectado');
    app.listen(app.get('port'), () => {
        console.log(`Servidor iniciado en puerto: ${app.get('port')}`);
    });
});

client.on('error', function (err: any) {
    console.log('Servicio Redis no se pudo conectar ' + err);
});
