import * as jwt from 'jsonwebtoken';
import config from '../configs/config';
export class Middleware {

    static secureJwt(req: any, res: any, next: any) {
        const token = req.headers['access-token'];
        if (token) {
            jwt.verify(token, config.key, (err: any, decoded: any) => {
                if (err) {
                    return res.json({ 
                        status: 401,
                        message: 'Token no valido' 
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                status: 403,
                message: 'No se incluyo token',
            });
        }
    };
}