import { Command } from 'commander'
import { emptyDirSync, outputJsonSync, removeSync } from 'fs-extra'
import { backgroundInfoParser } from './jtd/background-info'
import { DB, WithName } from './jtd/db'
import { effectDataValidator } from './jtd/effect-data'
import { effectInfoParser } from './jtd/effect-info'
import { engineInfoParser } from './jtd/engine-info'
import { levelInfoParser } from './jtd/level-info'
import { particleInfoParser } from './jtd/particle-info'
import { skinInfoParser } from './jtd/skin-info'
import { processInfos, processResource } from './process'

const options = new Command()
    .name('sonolus-pack')
    .version('0.1.0')
    .option('-i, --input <value>', 'input directory', 'source')
    .option('-o, --output <value>', 'output directory', 'pack')
    .parse()
    .opts()

const pathInput = options.input
const pathOutput = options.output

const db: DB = {
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

    processInfos(pathInput, pathOutput, 'levels', db.levels, levelInfoParser, [
        { name: 'cover', type: 'LevelCover', ext: 'png' },
        { name: 'bgm', type: 'LevelBgm', ext: 'mp3' },
        { name: 'data', type: 'LevelData', ext: 'json' },
    ])

    processInfos(pathInput, pathOutput, 'skins', db.skins, skinInfoParser, [
        { name: 'thumbnail', type: 'SkinThumbnail', ext: 'png' },
        { name: 'data', type: 'SkinData', ext: 'json' },
        { name: 'texture', type: 'SkinTexture', ext: 'png' },
    ])

    processInfos(
        pathInput,
        pathOutput,
        'backgrounds',
        db.backgrounds,
        backgroundInfoParser,
        [
            { name: 'thumbnail', type: 'BackgroundThumbnail', ext: 'png' },
            { name: 'data', type: 'BackgroundData', ext: 'json' },
            { name: 'image', type: 'BackgroundImage', ext: 'png' },
            {
                name: 'configuration',
                type: 'BackgroundConfiguration',
                ext: 'json',
            },
        ]
    )

    processInfos(
        pathInput,
        pathOutput,
        'effects',
        db.effects,
        effectInfoParser,
        [
            { name: 'thumbnail', type: 'EffectThumbnail', ext: 'png' },
            {
                name: 'data',
                type: 'EffectData',
                ext: 'json',
                jsonProcessor(json, path) {
                    if (effectDataValidator(json)) {
                        json.clips.forEach((clip) => {
                            processResource(pathOutput, path, clip, {
                                name: 'clip',
                                type: 'EffectClip',
                                filename: clip.name,
                                ext: 'mp3',
                            })
                            Object.assign(clip, { name: undefined })
                        })
                        return json
                    } else {
                        throw `${path}/data.json: ${effectDataValidator.errors
                            ?.map(
                                (error) =>
                                    `${error.instancePath} ${error.message}`
                            )
                            .join('; ')}`
                    }
                },
            },
        ]
    )

    processInfos(
        pathInput,
        pathOutput,
        'particles',
        db.particles,
        particleInfoParser,
        [
            { name: 'thumbnail', type: 'ParticleThumbnail', ext: 'png' },
            { name: 'data', type: 'ParticleData', ext: 'json' },
            { name: 'texture', type: 'ParticleTexture', ext: 'png' },
        ]
    )

    processInfos(
        pathInput,
        pathOutput,
        'engines',
        db.engines,
        engineInfoParser,
        [
            { name: 'thumbnail', type: 'EngineThumbnail', ext: 'png' },
            { name: 'data', type: 'EngineData', ext: 'json' },
            { name: 'configuration', type: 'EngineConfiguration', ext: 'json' },
        ]
    )

    db.levels.forEach((level) => {
        checkExists(db.engines, level.engine, `Level/${level.name}`)
        if (level.useSkin.item) {
            checkExists(db.skins, level.useSkin.item, `Level/${level.name}`)
        }
        if (level.useBackground.item) {
            checkExists(
                db.backgrounds,
                level.useBackground.item,
                `Level/${level.name}`
            )
        }
        if (level.useEffect.item) {
            checkExists(db.effects, level.useEffect.item, `Level/${level.name}`)
        }
        if (level.useParticle.item) {
            checkExists(
                db.particles,
                level.useParticle.item,
                `Level/${level.name}`
            )
        }
    })

    db.engines.forEach((engine) => {
        checkExists(db.skins, engine.skin, `Engine/${engine.name}`)
        checkExists(db.backgrounds, engine.background, `Engine/${engine.name}`)
        checkExists(db.effects, engine.effect, `Engine/${engine.name}`)
        checkExists(db.particles, engine.particle, `Engine/${engine.name}`)
    })

    outputJsonSync(`${pathOutput}/db.json`, db)

    console.log()
    console.log('[SUCCESS]', 'Packed to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}

function checkExists<T>(infos: WithName<T>[], name: string, parent: string) {
    if (!infos.find((info) => info.name === name)) {
        throw `${parent}: ${name} not found`
    }
}
