# Sonolus Pack

CLI tool to pack Sonolus source files into repository and database.

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://wiki.sonolus.com)
-   [sonolus-express](https://github.com/Sonolus/sonolus-express)
-   [sonolus-generate-static](https://github.com/Sonolus/sonolus-generate-static)

## Usage

### `npx`

Use `npx` to execute without installing.

Packing using default options:

```
npx @sonolus/pack
```

Use `-h` to see a list of available options:

```
npx @sonolus/pack -h
```

### Install Globally

Installing globally (only need once):

```
npm i -g @sonolus/pack
```

`sonolus-pack` will become available to use:

```
sonolus-pack -h
```

## Input

### Resources

Each resource (except `item.json`):

-   if a file with default extension is provided, it will be processed, and corresponding `SRL` will be generated.
-   if an extension-less file is provided, processing will be skipped, and corresponding `SRL` will be generated.
-   if an `.srl` extension file is provided, its content will be used as `SRL`.

For example resource `cover[.png/.srl]`:

-   if file `cover.png` is provided, it will be processed, and corresponding `SRL` will be generated.
-   if file `cover` is provided, processing will be skipped, and corresponding `SRL` will be generated.
-   if file `cover.srl` is provided, its content will be used as `SRL`.

### Localization Text

Common type for text with localization.

```ts
type LocalizationText = Record<string, string>
```

For example:

```json
{
    "en": "Hello!",
    "zhs": "你好！",
    "ja": "こんにちは！",
    "ko": "안녕하세요!"
}
```

### Tag

Common type for tag.

```ts
type Tag = {
    title: LocalizationText
    icon?: string
}
```

### Folder Structure

```
|   info.json
|   banner[.png/.srl]
|
+---posts
|   +---{post}
|   +---...
|   \---{post}
|           item.json
|           thumbnail[.png/.srl]
|
+---playlists
|   +---{playlist}
|   +---...
|   \---{playlist}
|           item.json
|           thumbnail[.png/.srl]
|
+---levels
|   +---{level}
|   +---...
|   \---{level}
|           item.json
|           cover[.png/.srl]
|           bgm[.mp3/.srl]
|           preview[.mp3/.srl]
|           data[.json/.srl]
|
+---skins
|   +---{skin}
|   +---...
|   \---{skin}
|           item.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           texture[.png/.srl]
|
+---backgrounds
|   +---{background}
|   +---...
|   \---{background}
|           item.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           image[.png/.srl]
|           configuration[.json/.srl]
|
+---effects
|   +---{effect}
|   +---...
|   \---{effect}
|           item.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           audio[.zip/.srl]
|
+---particles
|   +---{particle}
|   +---...
|   \---{particle}
|           item.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           texture[.png/.srl]
|
+---engines
|   +---{engine}
|   +---...
|   \---{engine}
|           item.json
|           thumbnail[.png/.srl]
|           playData[.json/.srl]
|           tutorialData[.json/.srl]
|           rom[.bin/.srl]
|           configuration[.json/.srl]
|
\---replays
    +---{replay}
    +---...
    \---{replay}
            item.json
            data[.json/.srl]
            configuration[.json/.srl]
```

### Server

Resources of server is located in `/`.

#### `info.json`

Server information.

```ts
type ServerInfo = {
    title: LocalizationText
}
```

#### `banner[.png/.srl]`

Optional, server banner.

### Posts

Resources of each post is located in `/posts/{post}`.

#### `item.json`

Post information.

```ts
type PostItem = {
    version: number
    title: LocalizationText
    time: number
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Optional, post thumbnail.

### Playlists

Resources of each playlist is located in `/playlists/{post}`.

#### `item.json`

Playlist information.

```ts
type PlaylistItem = {
    version: number
    title: LocalizationText
    time: number
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    levels: string[] // name of referenced levels
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Optional, playlist thumbnail.

### Levels

Resources of each level is located in `/levels/{name}`.

#### `item.json`

Level information.

```ts
type LevelItem = {
    version: number
    rating: number
    engine: string // name of referenced engine
    useSkin: UseItem
    useBackground: UseItem
    useEffect: UseItem
    useParticle: UseItem
    title: LocalizationText
    artists: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}

type UseItem =
    | {
          useDefault: true
      }
    | {
          useDefault: false
          item: string // name of referenced item
      }
```

#### `cover[.png/.srl]`

Level cover.

#### `bgm[.mp3/.srl]`

Level bgm.

#### `preview[.mp3/.srl]`

Optional, level preview.

#### `data[.json/.srl]`

Level data.

### Skins

Resources of each skin is located in `/skins/{skin}`.

#### `item.json`

Skin information.

```ts
type SkinItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Skin thumbnail.

#### `data[.json/.srl]`

Skin data.

#### `texture[.png/.srl]`

Skin texture.

### Backgrounds

Resources of each background is located in `/backgrounds/{background}`.

#### `item.json`

Background information.

```ts
type BackgroundItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Background thumbnail.

#### `data[.json/.srl]`

Background data.

#### `image[.png/.srl]`

Background image.

#### `configuration[.json/.srl]`

Background configuration.

### Effects

Resources of each effect is located in `/effects/{effect}`.

#### `item.json`

Effect information.

```ts
type EffectItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Effect thumbnail.

#### `data[.json/.srl]`

Effect data.

#### `audio[.zip/.srl]`

Effect audio.

### Particles

Resources of each particle is located in `/particles/{particle}`.

#### `item.json`

Particle information.

```ts
type ParticleItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Particle thumbnail.

#### `data[.json/.srl]`

Particle data.

#### `texture[.png/.srl]`

Particle texture.

### Engines

Resources of each engine is located in `/engines/{engine}`.

#### `item.json`

Engine information.

```ts
type EngineItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    skin: string // name of referenced skin
    background: string // name of referenced background
    effect: string // name of referenced effect
    particle: string // name of referenced particle
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Engine thumbnail.

#### `playData[.json/.srl]`

Engine play data.

#### `tutorialData[.json/.srl]`

Engine tutorial data.

#### `rom[.bin/.srl]`

Optional, engine rom.

#### `configuration[.json/.srl]`

Engine configuration.

### Replays

Resources of each replay is located in `/replays/{replay}`.

#### `item.json`

Replay information.

```ts
type ReplayItem = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    tags: Tag[]
    description: LocalizationText
    level: string // name of referenced level
    meta?: unknown // (optional) user-defined meta information
}
```

#### `data[.json/.srl]`

Replay data.

#### `configuration[.json/.srl]`

Replay configuration.

## Output

Output contains:

-   `/repository` contains processed resources.
-   `/db.json` contains information of items.

Output can be used by [sonolus-express](https://github.com/Sonolus/sonolus-express) and [sonolus-generate-static](https://github.com/Sonolus/sonolus-generate-static) to develop Sonolus servers.
