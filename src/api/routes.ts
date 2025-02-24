import { Router } from 'express';
import { runHeadless, THeadlessConfig } from '../../tools/headless';

export const apiRoutes = Router();

// Default configuration - you may want to adjust these values
const defaultConfig: THeadlessConfig = {
    import: {
        file: './input/model.obj',
        scale: 1
    },
    voxelise: {
        size: 128,
        enableAmbientOcclusion: true
    },
    assign: {
        atlas: 'default',
        palette: 'default'
    },
    export: {
        format: 'obj',
        outputPath: './output'
    },
    debug: {
        showLogs: true,
        showWarnings: true,
        showTimings: true
    }
};

apiRoutes.post('/process', async (req, res) => {
    try {
        // Merge provided config with defaults
        const config: THeadlessConfig = {
            ...defaultConfig,
            ...req.body
        };

        // Run the headless processing
        await runHeadless(config);

        res.json({
            success: true,
            message: 'Processing completed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
});

// Health check endpoint
apiRoutes.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
