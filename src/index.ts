#! /usr/bin/env node

import { Command } from 'commander'
import { emptyDirSync, outputJsonSync, removeSync } from 'fs-extra'
import { Database, DatabaseServerInfo } from 'sonolus-core'
import { processItem, processItems } from './process'
import { partialDatabaseBackgroundItemParser } from './schemas/background-item'
import { partialDatabaseEffectItemParser } from './schemas/effect-item'
import { partialDatabaseEngineItemParser } from './schemas/engine-item'
import { partialDatabaseLevelItemParser } from './schemas/level-item'
import { partialDatabaseParticleItemParser } from './schemas/particle-item'
import { partialDatabasePlaylistItemParser } from './schemas/playlist-item'
import { partialDatabasePostItemParser } from './schemas/post-item'
import { partialDatabaseReplayItemParser } from './schemas/replay-item'
import { partialDatabaseServerInfoParser } from './schemas/server-info'
import { partialDatabaseSkinItemParser } from './schemas/skin-item'

const options = new Command()
    .name('sonolus-pack')
    .version('5.3.0')
    .option('-i, --input <value>', 'input directory', 'source')
    .option('-o, --output <value>', 'output directory', 'pack')
    .parse()
    .opts()

const pathInput = options.input as string
const pathOutput = options.output as string

const checkExists = (items: { name: string }[], name: string, parent: string, path: string) => {
    if (!items.find((item) => item.name === name))
        throw new Error(`${parent}: ${name} not found (${path})`)
}

try {
    console.log('[INFO]', 'Packing:', pathInput)
    console.log()

    emptyDirSync(pathOutput)

    const serverInfo = processItem<DatabaseServerInfo>(
        pathInput,
        pathOutput,
        'info',
        partialDatabaseServerInfoParser,
        {
            banner: { type: 'ServerBanner', ext: 'png', optional: true },
        },
    )

    const db: Database = {
        info: serverInfo,
        posts: [],
        playlists: [],
        levels: [],
        skins: [],
        backgrounds: [],
        effects: [],
        particles: [],
        engines: [],
        replays: [],
    }

    processItems(pathInput, pathOutput, 'posts', db.posts, partialDatabasePostItemParser, {
        thumbnail: { type: 'PostThumbnail', ext: 'png', optional: true },
    })

    processItems(
        pathInput,
        pathOutput,
        'playlists',
        db.playlists,
        partialDatabasePlaylistItemParser,
        {
            thumbnail: { type: 'PlaylistThumbnail', ext: 'png', optional: true },
        },
    )

    processItems(pathInput, pathOutput, 'levels', db.levels, partialDatabaseLevelItemParser, {
        cover: { type: 'LevelCover', ext: 'png' },
        bgm: { type: 'LevelBgm', ext: 'mp3' },
        preview: { type: 'LevelPreview', ext: 'mp3', optional: true },
        data: { type: 'LevelData', ext: 'json' },
    })

    processItems(pathInput, pathOutput, 'skins', db.skins, partialDatabaseSkinItemParser, {
        thumbnail: { type: 'SkinThumbnail', ext: 'png' },
        data: { type: 'SkinData', ext: 'json' },
        texture: { type: 'SkinTexture', ext: 'png' },
    })

    processItems(
        pathInput,
        pathOutput,
        'backgrounds',
        db.backgrounds,
        partialDatabaseBackgroundItemParser,
        {
            thumbnail: { type: 'BackgroundThumbnail', ext: 'png' },
            data: { type: 'BackgroundData', ext: 'json' },
            image: { type: 'BackgroundImage', ext: 'png' },
            configuration: { type: 'BackgroundConfiguration', ext: 'json' },
        },
    )

    processItems(pathInput, pathOutput, 'effects', db.effects, partialDatabaseEffectItemParser, {
        thumbnail: { type: 'EffectThumbnail', ext: 'png' },
        data: { type: 'EffectData', ext: 'json' },
        audio: { type: 'EffectAudio', ext: 'zip' },
    })

    processItems(
        pathInput,
        pathOutput,
        'particles',
        db.particles,
        partialDatabaseParticleItemParser,
        {
            thumbnail: { type: 'ParticleThumbnail', ext: 'png' },
            data: { type: 'ParticleData', ext: 'json' },
            texture: { type: 'ParticleTexture', ext: 'png' },
        },
    )

    processItems(pathInput, pathOutput, 'engines', db.engines, partialDatabaseEngineItemParser, {
        thumbnail: { type: 'EngineThumbnail', ext: 'png' },
        playData: { type: 'EnginePlayData', ext: 'json' },
        watchData: { type: 'EngineWatchData', ext: 'json' },
        previewData: { type: 'EnginePreviewData', ext: 'json' },
        tutorialData: { type: 'EngineTutorialData', ext: 'json' },
        rom: { type: 'EngineRom', ext: 'bin', optional: true },
        configuration: { type: 'EngineConfiguration', ext: 'json' },
    })

    processItems(pathInput, pathOutput, 'replays', db.replays, partialDatabaseReplayItemParser, {
        data: { type: 'ReplayData', ext: 'json' },
        configuration: { type: 'ReplayConfiguration', ext: 'json' },
    })

    db.playlists.forEach((playlist) => {
        const parent = `Playlist/${playlist.name}`

        playlist.levels.forEach((level, index) => {
            checkExists(db.levels, level, parent, `.levels[${index}]`)
        })
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

    db.replays.forEach((replay) => {
        const parent = `Replay/${replay.name}`

        checkExists(db.levels, replay.level, parent, '.level')
    })

    outputJsonSync(`${pathOutput}/db.json`, db)

    console.log()
    console.log('[SUCCESS]', 'Packed to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}
