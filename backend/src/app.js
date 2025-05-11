import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import { eventsRouter } from './routes/events.route.js';
import { userRouter } from './routes/user.route.js';

app.use("/api/v1/fetch-events", eventsRouter)
app.use("/api/v1/get-user", userRouter)

export default app;