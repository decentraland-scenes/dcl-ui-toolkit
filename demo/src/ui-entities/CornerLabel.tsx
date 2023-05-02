import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const cornerLabel = new ui.CornerLabel({ value: 'Label', xOffset: -300, yOffset: 70 })

// cornerLabel.show()

cornerLabel.set('Label text')

cornerLabel.color = Color4.Green()
