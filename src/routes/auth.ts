
import * as jwt from 'jsonwebtoken';
import config from '../../configs/config';
export class Auth {

    static async register(req: any, res: any, redis: any) {
        const password = await this.getPass(req.body.user, redis);
        if (password !== null) {
            res.json({
                status: 400,
                message: 'El usuario ingresado ya existe',
            });
            return;
        }
        const result = await redis.set(req.body.user, req.body.password);
        if (result) {
            res.json({
                status: 201,
                message: 'Registro existoso',
            });
        } else {
            res.json({
                status: 500,
                message: 'No se pudo realizar el registro'
            });
        }
    }

    static async login(req: any, res: any, redis: any) {
        const password = await this.getPass(req.body.user, redis);
        if (password !== null) {
            if (password !== req.body.password) {
                res.json({
                    status: 400,
                    message: 'Usuario o password no valido',
                });
                return;
            }
            const payload = {
                check: true
            };
            const token = jwt.sign(payload, config.key, {
                expiresIn: 120,
            });
            res.json({
                status: 200,
                message: 'Autenticación correcta',
                token: token
            });
            return;
        }else{
            res.json({
                status: 400,
                message: 'Usuario o password no valido',
            });
            return;
        }
    }
    private static async getPass(user: string, redis: any) {
        const password = await new Promise((resolve) => {
            redis.get(user, (err: any, result: any) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            })
        }).then();
        return password;
    }
}
