import { LOG_MAJOR } from '../util/log_util';
import { startServer } from './server';

// Start the API server
LOG_MAJOR('Starting API server...');
startServer();
