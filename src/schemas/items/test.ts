import { TSchema } from '@sinclair/typebox'
import { Remove, SRLKey } from '../../utils/item'
import { PartialDatabaseSchemaToMatch } from '../test'

export type PartialDatabaseItemSchemaToMatch<A extends TSchema, B> = PartialDatabaseSchemaToMatch<
    A,
    Remove<B, 'name' | SRLKey<B>>
>
