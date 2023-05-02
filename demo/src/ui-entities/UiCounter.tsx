import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const uiCounter = new ui.UICounter({ value: 123 })

// uiCounter.show()

uiCounter.color = Color4.Blue()