import express from 'express';
import { json } from 'body-parser';
import { apiRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(json());

// Routes
app.use('/api', apiRoutes);

export function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
