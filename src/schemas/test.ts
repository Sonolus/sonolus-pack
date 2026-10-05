import { StaticDecode, TSchema } from 'typebox'

import { Remove, SrlKey } from '../utils/item.js'
import { MutuallyAssignable } from '../utils/test.js'

export type SchemaToMatch<A extends TSchema, B> = MutuallyAssignable<StaticDecode<A>, B>

export type PartialDatabaseSchemaToMatch<A extends TSchema, B> = SchemaToMatch<
    A,
    Remove<B, SrlKey<B>>
>
