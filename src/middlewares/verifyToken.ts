import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

class verifyJWT{
    async verifyTokenAdmin (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ error: 'Acesso negado' });
        try {
            jwt.verify(token, process.env.SECRET_USER_ADMIN, (err: object, decoded: object) => {
                if (err) {
                    return res.status(401).json({ error: 'Token inválido.' })
                }
                return next();
            });
        } catch (err) {
            res.status(400).json({ error: 'Token não fornecido.' });
        }
    }

    async verifyTokenUserCommon (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ error: 'Acesso negado' });
        try {
            jwt.verify(token, process.env.SECRET_USER_COMMON, (err: object, decoded: object) => {
                if (err) {
                    return res.status(401).json({ error: 'Token inválido.' })
                }
                return next();
            });
        } catch (err) {
            res.status(400).json({ error: 'Token não fornecido.' });
        }
    }
       
}

export default new verifyJWT();