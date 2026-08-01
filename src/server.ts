import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import categoryRoute from './routes/category.routes.js';
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.route.js';
import orderRoute from './routes/order.route.js';

export class Server {

    private app: Application;
    private port: string | undefined;

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
        this.app.use(errorHandler);
    }

    middlewares() {
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL del frontend (Vite en local, Vercel en producción)
            credentials: true // Vital para aceptar las cookies HttpOnly
        }));
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(cookieParser());
    }

    routes() {
        this.app.use("/api/health", (_req, res) => {
            res.json({ status: "✅ Backend connected.", timestamp_UTC: new Date(), region: "Lima, Perú" })
        });
        this.app.use("/api/users", userRoute);
        this.app.use("/api/auth", authRoute);


        this.app.use("/api/categories", categoryRoute);
        this.app.use("/api/products", productRoute);
        this.app.use("/api/cart", cartRoute);
        this.app.use("/api/orders", orderRoute);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`✅ Server running on: http://localhost:${this.port}/api/health`);
        });
    }
}