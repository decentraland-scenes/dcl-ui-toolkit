import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const uiBar = new ui.UIBar({ value: .5, xOffset: -500, yOffset: 60 })

// uiBar.show()

uiBar.set(0.92)

uiBar.color = Color4.Blue()