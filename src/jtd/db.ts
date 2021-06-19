import { BackgroundInfo } from './background-info'
import { EffectInfo } from './effect-info'
import { EngineInfo } from './engine-info'
import { LevelInfo } from './level-info'
import { ParticleInfo } from './particle-info'
import { SkinInfo } from './skin-info'

export type WithName<T> = T & { name: string }

export type DB = {
    levels: WithName<LevelInfo>[]
    skins: WithName<SkinInfo>[]
    backgrounds: WithName<BackgroundInfo>[]
    effects: WithName<EffectInfo>[]
    particles: WithName<ParticleInfo>[]
    engines: WithName<EngineInfo>[]
}
