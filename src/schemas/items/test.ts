import { TSchema } from '@sinclair/typebox'
import { Remove, SrlKey } from '../../utils/item.js'
import { PartialDatabaseSchemaToMatch } from '../test.js'

export type PartialDatabaseItemSchemaToMatch<A extends TSchema, B> = PartialDatabaseSchemaToMatch<
    A,
    Remove<B, 'name' | SrlKey<B>>
>
