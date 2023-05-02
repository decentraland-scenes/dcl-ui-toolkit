import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { DelayedHidingUIObject, DelayedHidingUIObjectConfig } from '../UIObject'

import { getImageAtlasMapping, ImageAtlasData } from '../../utils/imageUtils'

export type CenterImageImageElement = Omit<EntityPropTypes, 'uiTransform' | 'uiBackground'> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'display' | 'width' | 'height' | 'margin'
  >
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'texture' | 'uvs'>
}

type CenterImageConfig = DelayedHidingUIObjectConfig & {
  image: string
  duration: number
  width?: number
  height?: number
  xOffset?: number
  yOffset?: number
  section?: ImageAtlasData
}

const centerImageInitialConfig: Omit<Required<CenterImageConfig>, 'section'> = {
  image: '',
  duration: 0,
  startHidden: true,
  width: 512,
  height: 512,
  xOffset: 0,
  yOffset: 0,
} as const

/**
 * Displays an image of 512x512 in the center of the screen for limited time.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string} image path to image file
 * @param {number} [duration=0] duration time to keep the image visible (in seconds) if starting visible
 * @param {number} [xOffset=0] offset on X
 * @param {number} [yOffset=0] offset on Y
 * @param {number} [width=512] image width
 * @param {number} [height=512] image height
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class CenterImage extends DelayedHidingUIObject {
  public imageElement: CenterImageImageElement

  public image: string
  public width: number
  public height: number
  public xOffset: number
  public yOffset: number
  public section: ImageAtlasData | undefined

  constructor({
    startHidden = centerImageInitialConfig.startHidden,
    image = centerImageInitialConfig.image,
    duration = centerImageInitialConfig.duration,
    width = centerImageInitialConfig.width,
    height = centerImageInitialConfig.height,
    xOffset = centerImageInitialConfig.xOffset,
    yOffset = centerImageInitialConfig.yOffset,
    section,
  }: CenterImageConfig) {
    super({ startHidden, duration })

    this.image = image
    this.width = width
    this.height = height
    this.xOffset = xOffset
    this.yOffset = yOffset
    if (section) this.section = section

    this.imageElement = {
      uiTransform: {
        positionType: 'absolute',
        position: { top: '50%', left: '50%' },
      },
      uiBackground: {
        textureMode: 'stretch',
      },
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiTransform={{
          ...this.imageElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          width: this.width,
          height: this.height,
          margin: { top: this.yOffset * -1 - this.height / 2, left: this.xOffset - this.width / 2 },
        }}
        uiBackground={{
          ...this.imageElement.uiBackground,
          texture: {
            src: this.image,
          },
          uvs: getImageAtlasMapping(this.section),
        }}
      />
    )
  }
}
