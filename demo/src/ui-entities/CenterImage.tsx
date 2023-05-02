import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const centerImage = new ui.CenterImage({ duration: 0, image: 'images/scene-thumbnail.png' })

// centerImage.show()

centerImage.imageElement.uiBackground!.color = Color4.create(255, 255, 255, 0.5)