import express from 'express';
import { json } from 'body-parser';
import { apiRoutes } from './routes';
import { AppPaths, PathUtil } from '../util/path_util';
import { Logger } from '../util/log_util';

const app = express();
const port = process.env.PORT || 3000;

// Initialize paths and logging
AppPaths.Get.setBaseDir(PathUtil.join(__dirname, '../..'));
Logger.Get.enableLogToFile();
Logger.Get.initLogFile('api-server');

// Middleware
app.use(json());

// Routes
app.use('/api', apiRoutes);

export function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
