import express from 'express';
import type { Express } from 'express';

import { authRouter } from './auth/routes.js';

export function createApplication(): Express {
    const app = express();

    //Middlewares
    app.use(express.json());

    // Routes
    app.get('/', (req, res) => {
        res.json({ message: 'Hello, World!' });
    });


    app.use("/auth", authRouter);



    return app
}