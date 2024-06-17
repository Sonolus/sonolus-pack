import { SRL } from '@sonolus/core'

export type SRLKey<T> = {
    [K in keyof T]-?: T[K] extends SRL | undefined ? K : never
}[keyof T]

export type Remove<T, K extends PropertyKey> = Omit<T, K> & Partial<Record<K, never>>
