#! /usr/bin/env node

import { Database } from '@sonolus/core'
import { Command } from 'commander'
import { emptyDirSync, outputJsonSync, removeSync } from 'fs-extra'
import { createProcessItems, processItem } from './process'
import { partialDatabaseBackgroundItemSchema } from './schemas/items/background'
import { partialDatabaseEffectItemSchema } from './schemas/items/effect'
import { partialDatabaseEngineItemSchema } from './schemas/items/engine'
import { partialDatabaseLevelItemSchema } from './schemas/items/level'
import { partialDatabaseParticleItemSchema } from './schemas/items/particle'
import { partialDatabasePlaylistItemSchema } from './schemas/items/playlist'
import { partialDatabasePostItemSchema } from './schemas/items/post'
import { partialDatabaseReplayItemSchema } from './schemas/items/replay'
import { partialDatabaseSkinItemSchema } from './schemas/items/skin'
import { partialDatabaseServerInfoSchema } from './schemas/serverInfo'

const options = new Command()
    .name('sonolus-pack')
    .version('5.4.7')
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

    const processItems = createProcessItems(pathInput, pathOutput)

    const db: Database = {
        info: processItem(pathInput, pathOutput, 'info', partialDatabaseServerInfoSchema, {
            banner: { ext: 'png', optional: true },
        }),

        posts: processItems('posts', partialDatabasePostItemSchema, {
            thumbnail: { ext: 'png', optional: true },
        }),

        playlists: processItems('playlists', partialDatabasePlaylistItemSchema, {
            thumbnail: { ext: 'png', optional: true },
        }),

        levels: processItems('levels', partialDatabaseLevelItemSchema, {
            cover: { ext: 'png' },
            bgm: { ext: 'mp3' },
            preview: { ext: 'mp3', optional: true },
            data: { ext: 'json' },
        }),

        skins: processItems('skins', partialDatabaseSkinItemSchema, {
            thumbnail: { ext: 'png' },
            data: { ext: 'json' },
            texture: { ext: 'png' },
        }),

        backgrounds: processItems('backgrounds', partialDatabaseBackgroundItemSchema, {
            thumbnail: { ext: 'png' },
            data: { ext: 'json' },
            image: { ext: 'png' },
            configuration: { ext: 'json' },
        }),

        effects: processItems('effects', partialDatabaseEffectItemSchema, {
            thumbnail: { ext: 'png' },
            data: { ext: 'json' },
            audio: { ext: 'zip' },
        }),

        particles: processItems('particles', partialDatabaseParticleItemSchema, {
            thumbnail: { ext: 'png' },
            data: { ext: 'json' },
            texture: { ext: 'png' },
        }),

        engines: processItems('engines', partialDatabaseEngineItemSchema, {
            thumbnail: { ext: 'png' },
            playData: { ext: 'json' },
            watchData: { ext: 'json' },
            previewData: { ext: 'json' },
            tutorialData: { ext: 'json' },
            rom: { ext: 'bin', optional: true },
            configuration: { ext: 'json' },
        }),

        replays: processItems('replays', partialDatabaseReplayItemSchema, {
            data: { ext: 'json' },
            configuration: { ext: 'json' },
        }),
    }

    for (const playlist of db.playlists) {
        const parent = `playlists/${playlist.name}`

        for (const [index, level] of playlist.levels.entries()) {
            checkExists(db.levels, level, parent, `/levels/${index}`)
        }
    }

    for (const level of db.levels) {
        const parent = `levels/${level.name}`

        checkExists(db.engines, level.engine, parent, '/engine')
        if (!level.useSkin.useDefault) {
            checkExists(db.skins, level.useSkin.item, parent, '/useSkin/item')
        }
        if (!level.useBackground.useDefault) {
            checkExists(db.backgrounds, level.useBackground.item, parent, '/useBackground/item')
        }
        if (!level.useEffect.useDefault) {
            checkExists(db.effects, level.useEffect.item, parent, '/useEffect/item')
        }
        if (!level.useParticle.useDefault) {
            checkExists(db.particles, level.useParticle.item, parent, '/useParticle/item')
        }
    }

    for (const engine of db.engines) {
        const parent = `engines/${engine.name}`

        checkExists(db.skins, engine.skin, parent, '/skin')
        checkExists(db.backgrounds, engine.background, parent, '/background')
        checkExists(db.effects, engine.effect, parent, '/effect')
        checkExists(db.particles, engine.particle, parent, '/particle')
    }

    for (const replay of db.replays) {
        const parent = `replays/${replay.name}`

        checkExists(db.levels, replay.level, parent, '/level')
    }

    outputJsonSync(`${pathOutput}/db.json`, db)

    console.log()
    console.log('[SUCCESS]', 'Packed to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}
