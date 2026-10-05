import { LocalizationText } from '@sonolus/core'
import Type from 'typebox'

import { Expect } from '../utils/test.js'
import { SchemaToMatch } from './test.js'

export const localizationTextSchema = Type.Union([
    Type.Record(Type.String(), Type.String()),
    Type.Decode(Type.String(), (value) => ({ en: value })),
])

type _Tests = Expect<[SchemaToMatch<typeof localizationTextSchema, LocalizationText>]>
