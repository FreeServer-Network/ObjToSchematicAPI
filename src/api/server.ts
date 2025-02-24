import { json } from 'body-parser';
import express from 'express';

import { LOG_MAJOR, Logger } from '../util/log_util';
import { AppPaths, PathUtil } from '../util/path_util';
import { apiRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3090;

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
        LOG_MAJOR(`Server is running on port ${port}`);
    });
}
