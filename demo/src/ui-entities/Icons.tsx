import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const smallIcon = new ui.SmallIcon({ image: 'images/scene-thumbnail.png', yOffset: 150 })
export const mediumIcon = new ui.MediumIcon({ image: 'images/scene-thumbnail.png', yOffset: 210 })
export const largeIcon = new ui.LargeIcon({ image: 'images/scene-thumbnail.png', yOffset: 300 })

// smallIcon.show()
// mediumIcon.show()
// largeIcon.show()

smallIcon.imageElement.uiBackground!.color = Color4.Blue()

mediumIcon.imageElement.uiBackground!.color = Color4.Yellow()

largeIcon.yOffset = 400