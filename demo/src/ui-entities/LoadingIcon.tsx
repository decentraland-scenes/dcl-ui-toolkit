import * as ui from '@dcl-sdk/ui-utils'
import { Color4 } from '@dcl/sdk/math'

export const loadingIcon = new ui.LoadingIcon({ yOffset: 350 })

// loadingIcon.show()

loadingIcon.imageElement.uiBackground!.color = Color4.Yellow()

loadingIcon.scale = .75