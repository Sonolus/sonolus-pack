import { Type } from '@sinclair/typebox'
import { DatabaseServerInfo } from '@sonolus/core'
import { Expect } from '../utils/test.js'
import { localizationTextSchema } from './localizationText.js'
import { PartialDatabaseSchemaToMatch } from './test.js'

export const partialDatabaseServerInfoSchema = Type.Object({
    title: localizationTextSchema,
    description: Type.Optional(localizationTextSchema),
})

type _Tests = Expect<
    [PartialDatabaseSchemaToMatch<typeof partialDatabaseServerInfoSchema, DatabaseServerInfo>]
>
