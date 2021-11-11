# sonolus-pack

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
npx sonolus-pack
```

Use `-h` to see a list of available options:

```
npx sonolus-pack -h
```

### Install Globally

Installing globally (only need once):

```
npm i -g sonolus-pack
```

`sonolus-pack` will become available to use:

```
sonolus-pack -h
```

## Input

### Resources

Each resource (except `info.json`):

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
    "zh-hans": "你好！",
    "ja": "こんにちは！",
    "ko": "안녕하세요!"
}
```

### Folder Structure

```
+---levels
|   +---{level}
|   +---...
|   \---{level}
|           info.json
|           cover[.png/.srl]
|           bgm[.mp3/.srl]
|           data[.json/.srl]
|
+---skins
|   +---{skin}
|   +---...
|   \---{skin}
|           info.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           texture[.png/.srl]
|
+---backgrounds
|   +---{background}
|   +---...
|   \---{background}
|           info.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           image[.png/.srl]
|
+---effects
|   +---{effect}
|   +---...
|   \---{effect}
|           info.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           {clip}[.mp3/.srl]
|           ...
|           {clip}[.mp3/.srl]
|
+---particles
|   +---{particle}
|   +---...
|   \---{particle}
|           info.json
|           thumbnail[.png/.srl]
|           data[.json/.srl]
|           texture[.png/.srl]
|
\---engines
    +---{engine}
    +---...
    \---{engine}
            info.json
            thumbnail[.png/.srl]
            data[.json/.srl]
            configuration[.json/.srl]
```

### Levels

Resources of each level is located in `/levels/{name}`.

#### `info.json`

Level information.

```ts
type LevelInfo = {
    version: number
    rating: number
    engine: string // name of referenced engine
    useSkin: Use
    useBackground: Use
    useEffect: Use
    useParticle: Use
    title: LocalizationText
    artists: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}

type Use = {
    useDefault: boolean
    item?: string // name of referenced item
}
```

#### `cover[.png/.srl]`

Level cover.

#### `bgm[.mp3/.srl]`

Level bgm.

#### `data[.json/.srl]`

Level data.

### Skins

Resources of each skin is located in `/skins/{skin}`.

#### `info.json`

Skin information.

```ts
type SkinInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
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

#### `info.json`

Background information.

```ts
type BackgroundInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
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

### Effects

Resources of each effect is located in `/effects/{effect}`.

#### `info.json`

Effect information.

```ts
type EffectInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown // (optional) user-defined meta information
}
```

#### `thumbnail[.png/.srl]`

Effect thumbnail.

#### `data[.json/.srl]`

Effect data.

Clips in effect data should simply be `string` that references the corresponding clip file.

#### `{clip}[.mp3/.srl]`

Effect clip referenced in effect data.

### Particles

Resources of each particle is located in `/particles/{particle}`.

#### `info.json`

Particle information.

```ts
type ParticleInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
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

#### `info.json`

Engine information.

```ts
type EngineInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
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

#### `data[.json/.srl]`

Engine data.

#### `configuration[.json/.srl]`

Engine configuration.

## Output

Output contains:

-   `/repository` contains processed resources.
-   `/db.json` contains information of items.

Output can be used by [sonolus-express](https://github.com/Sonolus/sonolus-express) and [sonolus-generate-static](https://github.com/Sonolus/sonolus-generate-static) to develop Sonolus servers.
