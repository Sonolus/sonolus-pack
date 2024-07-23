import { TSchema } from '@sinclair/typebox'
import { Remove, SrlKey } from '../../utils/item'
import { PartialDatabaseSchemaToMatch } from '../test'

export type PartialDatabaseItemSchemaToMatch<A extends TSchema, B> = PartialDatabaseSchemaToMatch<
    A,
    Remove<B, 'name' | SrlKey<B>>
>
