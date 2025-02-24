import { Router } from 'express';
import { runHeadless, THeadlessConfig } from '../../tools/headless';
import { Vector3 } from '../../src/vector';
import { ColourSpace } from '../../src/util';

export const apiRoutes = Router();

// Default configuration - you may want to adjust these values
const defaultConfig: THeadlessConfig = {
    import: {
        filepath: './input/model.obj', // Must be an absolute path
        rotation: new Vector3(0, 0, 0),
    },
    voxelise: {
        constraintAxis: 'y',
        voxeliser: 'bvh-ray',
        size: 80,
        useMultisampleColouring: false,
        voxelOverlapRule: 'average',
        enableAmbientOcclusion: false,
    },
    assign: {
        textureAtlas: 'vanilla',
        blockPalette: 'all-snapshot',
        dithering: 'ordered',
        colourSpace: ColourSpace.RGB,
        fallable: 'replace-falling',
        resolution: 32,
        calculateLighting: false,
        lightThreshold: 0,
        contextualAveraging: true,
        errorWeight: 0.0,
    },
    export: {
        filepath: './output/model', // Must be an absolute path
        exporter: 'schem',
    },
    debug: {
        showLogs: true,
        showWarnings: true,
        showTimings: true,
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
