import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
cors(corsOptions);
app.use(cors());

// Import routes
import { eventsRouter } from './routes/events.route.js';
import { userRouter } from './routes/user.route.js';

app.get("/", (req, res) => {
    res.status(200).send("Hello from the server");
});
app.use("/api/v1/fetch-events", eventsRouter)
app.use("/api/v1/save-user", userRouter)

export default app;