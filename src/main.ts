import { Command } from 'commander'
import { emptyDirSync, outputJsonSync, removeSync } from 'fs-extra'
import { Database } from 'sonolus-core'
import { processInfos } from './process'
import { partialBackgroundInfoParser } from './schemas/background-info'
import { partialEffectInfoParser } from './schemas/effect-info'
import { partialEngineInfoParser } from './schemas/engine-info'
import { partialLevelInfoParser } from './schemas/level-info'
import { partialParticleInfoParser } from './schemas/particle-info'
import { partialSkinInfoParser } from './schemas/skin-info'

const options = new Command()
    .name('sonolus-pack')
    .version('1.2.1')
    .option('-i, --input <value>', 'input directory', 'source')
    .option('-o, --output <value>', 'output directory', 'pack')
    .parse()
    .opts()

const pathInput = options.input
const pathOutput = options.output

const db: Database = {
    levels: [],
    skins: [],
    backgrounds: [],
    effects: [],
    particles: [],
    engines: [],
}

try {
    console.log('[INFO]', 'Packing:', pathInput)
    console.log()

    emptyDirSync(pathOutput)

    processInfos(
        pathInput,
        pathOutput,
        'levels',
        db.levels,
        partialLevelInfoParser,
        {
            cover: { type: 'LevelCover', ext: 'png' },
            bgm: { type: 'LevelBgm', ext: 'mp3' },
            preview: { type: 'LevelPreview', ext: 'mp3', optional: true },
            data: { type: 'LevelData', ext: 'json' },
        }
    )

    processInfos(
        pathInput,
        pathOutput,
        'skins',
        db.skins,
        partialSkinInfoParser,
        {
            thumbnail: { type: 'SkinThumbnail', ext: 'png' },
            data: { type: 'SkinData', ext: 'json' },
            texture: { type: 'SkinTexture', ext: 'png' },
        }
    )

    processInfos(
        pathInput,
        pathOutput,
        'backgrounds',
        db.backgrounds,
        partialBackgroundInfoParser,
        {
            thumbnail: { type: 'BackgroundThumbnail', ext: 'png' },
            data: { type: 'BackgroundData', ext: 'json' },
            image: { type: 'BackgroundImage', ext: 'png' },
            configuration: { type: 'BackgroundConfiguration', ext: 'json' },
        }
    )

    processInfos(
        pathInput,
        pathOutput,
        'effects',
        db.effects,
        partialEffectInfoParser,
        {
            thumbnail: { type: 'EffectThumbnail', ext: 'png' },
            data: { type: 'EffectData', ext: 'json' },
            audio: { type: 'EffectAudio', ext: 'zip' },
        }
    )

    processInfos(
        pathInput,
        pathOutput,
        'particles',
        db.particles,
        partialParticleInfoParser,
        {
            thumbnail: { type: 'ParticleThumbnail', ext: 'png' },
            data: { type: 'ParticleData', ext: 'json' },
            texture: { type: 'ParticleTexture', ext: 'png' },
        }
    )

    processInfos(
        pathInput,
        pathOutput,
        'engines',
        db.engines,
        partialEngineInfoParser,
        {
            thumbnail: { type: 'EngineThumbnail', ext: 'png' },
            data: { type: 'EngineData', ext: 'json' },
            rom: { type: 'EngineRom', ext: 'bin', optional: true },
            configuration: { type: 'EngineConfiguration', ext: 'json' },
        }
    )

    db.levels.forEach((level) => {
        const parent = `Level/${level.name}`

        checkExists(db.engines, level.engine, parent, '.engine')
        if (level.useSkin.item) {
            checkExists(db.skins, level.useSkin.item, parent, '.useSkin.item')
        }
        if (level.useBackground.item) {
            checkExists(
                db.backgrounds,
                level.useBackground.item,
                parent,
                '.useBackground.item'
            )
        }
        if (level.useEffect.item) {
            checkExists(
                db.effects,
                level.useEffect.item,
                parent,
                '.useEffect.item'
            )
        }
        if (level.useParticle.item) {
            checkExists(
                db.particles,
                level.useParticle.item,
                parent,
                '.useParticle.item'
            )
        }
    })

    db.engines.forEach((engine) => {
        const parent = `Engine/${engine.name}`

        checkExists(db.skins, engine.skin, parent, '.skin')
        checkExists(db.backgrounds, engine.background, parent, '.background')
        checkExists(db.effects, engine.effect, parent, '.effect')
        checkExists(db.particles, engine.particle, parent, '.particle')
    })

    outputJsonSync(`${pathOutput}/db.json`, db)

    console.log()
    console.log('[SUCCESS]', 'Packed to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}

function checkExists(
    infos: { name: string }[],
    name: string,
    parent: string,
    path: string
) {
    if (!infos.find((info) => info.name === name)) {
        throw `${parent}: ${name} not found (${path})`
    }
}
