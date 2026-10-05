import { DatabaseServerInfo } from '@sonolus/core'
import Type from 'typebox'

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
