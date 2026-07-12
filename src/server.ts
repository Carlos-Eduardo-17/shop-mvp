import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

export class Server {

    private app: Application;
    private port: string | undefined;

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
    }

    routes() {
        this.app.use("/api/health", (_req, res) => {
            res.json({ status: "✅ Backend connected.", timestamp_UTC: new Date(), region: "Lima, Perú" })
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`✅ Server running on: http://localhost:${this.port}/api/health`);
        });
    }
}