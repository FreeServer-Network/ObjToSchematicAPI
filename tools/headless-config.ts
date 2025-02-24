import { ColourSpace } from '../src/util';
import { Vector3 } from '../src/vector';
import { THeadlessConfig } from './headless';

export const headlessConfig: THeadlessConfig = {
    import: {
        filepath: '/Users/lucasdower/ObjToSchematic/res/samples/skull.obj', // Must be an absolute path
        rotation: new Vector3(0, 0, 0),
    },
    material: {
        materials: new Map([
            ['default', {
                type: MaterialType.solid,
                colour: { r: 1, g: 1, b: 1, a: 1 },
                canBeTextured: false,
                needsAttention: false
            }],
            ['texture-example', {
                type: MaterialType.textured,
                path: 'C:\\absolute\\path\\to\\texture.png',
                interpolation: 'nearest',
                extension: 'clamp',
                transparency: { type: 'None' },
                needsAttention: false
            }]
        ])
    },
    voxelise: {
        constraintAxis: 'y',
        voxeliser: 'bvh-ray',
        size: 80,
        useMultisampleColouring: false,
        voxelOverlapRule: 'average',
        enableAmbientOcclusion: false, // Only want true if exporting to .obj
    },
    assign: {
        textureAtlas: 'vanilla', // Must be an atlas name that exists in /resources/atlases
        blockPalette: 'all-snapshot', // Must be a palette name that exists in /resources/palettes
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
        filepath: '/Users/lucasdower/Documents/out.obj', // Must be an absolute path to the file (can be anywhere)
        exporter: 'obj', // 'schematic' / 'litematic',
    },
    debug: {
        showLogs: true,
        showWarnings: true,
        showTimings: true,
    },
};
