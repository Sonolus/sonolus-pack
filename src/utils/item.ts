import { Srl } from '@sonolus/core'

export type SrlKey<T> = {
    [K in keyof T]-?: Srl extends T[K] ? K : never
}[keyof T]

export type Remove<T, K extends PropertyKey> = Omit<T, K> & Partial<Record<K, never>>
