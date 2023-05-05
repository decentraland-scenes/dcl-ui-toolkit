import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const announcement = ui.createComponent(ui.Announcement, { startHidden: true, value: 'Text center', yOffset: 400, duration: 3 })

announcement.color = Color4.Blue()

announcement.value = 'Another text'
