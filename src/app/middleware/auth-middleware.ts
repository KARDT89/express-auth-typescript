import type { Request, Response, NextFunction } from 'express';
import { verifyUserToken } from '../auth/utils/tokens.js';

export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if(!header) return next()

        if(!header?.startsWith("Bearer")) return res.status(401).json({ error: "unauthorized", message: "invalid token format" });

        const token = header.split(" ")[1]

        if(!token) return res.status(401).json({ error: "unauthorized", message: "token not provided" });

        const user = verifyUserToken(token)

        // @ts-ignore
        req.user = user
        return next();

    }
}

export function restrictToAuthenticated() {
    return function (req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        if(!req.user) return res.status(401).json({ error: "unauthorized", message: "authentication required" });
        next();
    }
};
   
   