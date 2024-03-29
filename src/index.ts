#! /usr/bin/env node

import { Command } from 'commander'
import { emptyDirSync, outputJsonSync, removeSync } from 'fs-extra'
import { Database } from 'sonolus-core'
import { processInfo, processInfos } from './process'
import { partialBackgroundInfoParser } from './schemas/background-info'
import { partialEffectInfoParser } from './schemas/effect-info'
import { partialEngineInfoParser } from './schemas/engine-info'
import { partialLevelInfoParser } from './schemas/level-info'
import { partialParticleInfoParser } from './schemas/particle-info'
import { partialServerInfoParser } from './schemas/server-info'
import { partialSkinInfoParser } from './schemas/skin-info'

const options = new Command()
    .name('sonolus-pack')
    .version('5.3.0')
    .option('-i, --input <value>', 'input directory', 'source')
    .option('-o, --output <value>', 'output directory', 'pack')
    .parse()
    .opts()

const pathInput = options.input as string
const pathOutput = options.output as string

const checkExists = (infos: { name: string }[], name: string, parent: string, path: string) => {
    if (!infos.find((info) => info.name === name))
        throw new Error(`${parent}: ${name} not found (${path})`)
}

try {
    console.log('[INFO]', 'Packing:', pathInput)
    console.log()

    emptyDirSync(pathOutput)

    const info = processInfo<Database['info']>(pathInput, pathOutput, partialServerInfoParser, {
        banner: { type: 'ServerBanner', ext: 'png' },
    })

    const db: Database = {
        info,
        levels: [],
        skins: [],
        backgrounds: [],
        effects: [],
        particles: [],
        engines: [],
    }

    processInfos(pathInput, pathOutput, 'levels', db.levels, partialLevelInfoParser, {
        cover: { type: 'LevelCover', ext: 'png' },
        bgm: { type: 'LevelBgm', ext: 'mp3' },
        preview: { type: 'LevelPreview', ext: 'mp3', optional: true },
        data: { type: 'LevelData', ext: 'json' },
    })

    processInfos(pathInput, pathOutput, 'skins', db.skins, partialSkinInfoParser, {
        thumbnail: { type: 'SkinThumbnail', ext: 'png' },
        data: { type: 'SkinData', ext: 'json' },
        texture: { type: 'SkinTexture', ext: 'png' },
    })

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
        },
    )

    processInfos(pathInput, pathOutput, 'effects', db.effects, partialEffectInfoParser, {
        thumbnail: { type: 'EffectThumbnail', ext: 'png' },
        data: { type: 'EffectData', ext: 'json' },
        audio: { type: 'EffectAudio', ext: 'zip' },
    })

    processInfos(pathInput, pathOutput, 'particles', db.particles, partialParticleInfoParser, {
        thumbnail: { type: 'ParticleThumbnail', ext: 'png' },
        data: { type: 'ParticleData', ext: 'json' },
        texture: { type: 'ParticleTexture', ext: 'png' },
    })

    processInfos(pathInput, pathOutput, 'engines', db.engines, partialEngineInfoParser, {
        thumbnail: { type: 'EngineThumbnail', ext: 'png' },
        playData: { type: 'EnginePlayData', ext: 'json' },
        watchData: { type: 'EngineWatchData', ext: 'json' },
        previewData: { type: 'EnginePreviewData', ext: 'json' },
        tutorialData: { type: 'EngineTutorialData', ext: 'json' },
        rom: { type: 'EngineRom', ext: 'bin', optional: true },
        configuration: { type: 'EngineConfiguration', ext: 'json' },
    })

    db.levels.forEach((level) => {
        const parent = `Level/${level.name}`

        checkExists(db.engines, level.engine, parent, '.engine')
        if (!level.useSkin.useDefault) {
            checkExists(db.skins, level.useSkin.item, parent, '.useSkin.item')
        }
        if (!level.useBackground.useDefault) {
            checkExists(db.backgrounds, level.useBackground.item, parent, '.useBackground.item')
        }
        if (!level.useEffect.useDefault) {
            checkExists(db.effects, level.useEffect.item, parent, '.useEffect.item')
        }
        if (!level.useParticle.useDefault) {
            checkExists(db.particles, level.useParticle.item, parent, '.useParticle.item')
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
