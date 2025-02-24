import { Router } from 'express';
import path from 'path';

import { ColourSpace } from '../../src/util';
import { Vector3 } from '../../src/vector';
import { runHeadless, THeadlessConfig } from '../../tools/headless';

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
    },
};

apiRoutes.post('/process', async (req, res) => {
    try {
        const filepath = req.body.import?.filepath;
    
        let sanitizedPath;
        if (filepath && /^[a-zA-Z]:/.test(filepath)) {
            const driveLetter = filepath.slice(0, 2);
            const pathPart = filepath.slice(2); 
            sanitizedPath = driveLetter + pathPart.replace(/[<>"|?*]/g, '_');
        } else {
            sanitizedPath = filepath?.replace(/[<>:"|?*]/g, '_');
        }
    
    
        if (sanitizedPath) {
            const isWinAbsolute = /^[a-zA-Z]:[\\\/]/.test(sanitizedPath);
            const isUnixAbsolute = path.isAbsolute(sanitizedPath);
        
            if (!isWinAbsolute && !isUnixAbsolute) {
                throw new Error('Filepath must be absolute');
            }
        }

        // Deep merge provided config with defaults
        const config: THeadlessConfig = {
            import: {
                ...defaultConfig.import,
                ...(req.body.import || {}),
                // Sanitize filepath if provided
                ...(sanitizedPath && { filepath: sanitizedPath }),
                // Ensure Vector3 instance for rotation
                rotation: req.body.import?.rotation ? 
                    new Vector3(
                        req.body.import.rotation.x || 0,
                        req.body.import.rotation.y || 0,
                        req.body.import.rotation.z || 0,
                    ) :
                    defaultConfig.import.rotation,
            },
            voxelise: {
                ...defaultConfig.voxelise,
                ...(req.body.voxelise || {}),
            },
            assign: {
                ...defaultConfig.assign,
                ...(req.body.assign || {}),
            },
            export: {
                ...defaultConfig.export,
                ...(req.body.export || {}),
            },
            debug: {
                ...defaultConfig.debug,
                ...(req.body.debug || {}),
            },
        };

        // Run the headless processing
        await runHeadless(config);

        res.json({
            success: true,
            message: 'Processing completed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
});

// Health check endpoint
apiRoutes.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
