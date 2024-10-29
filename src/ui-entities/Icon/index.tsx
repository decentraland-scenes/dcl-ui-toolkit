import ReactEcs, { EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { UIObject, UIObjectConfig } from '../UIObject'

import { getImageAtlasMapping, ImageAtlasData } from '../../utils/imageUtils'
import { scaleFactor } from '../../utils/scaleFactor'

export type IconImageElement = Omit<EntityPropTypes, 'uiTransform' | 'uiBackground'> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'display' | 'position' | 'width' | 'height'
  >
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'texture' | 'uvs'>
}

export type IconConfig = UIObjectConfig & {
  image: string
  width?: number
  height?: number
  xOffset?: number
  yOffset?: number
  section?: ImageAtlasData
}

export type IconInitialConfig = {
  initial?: Omit<Required<IconConfig>, 'section'>
}

enum IconSize {
  'small' = 32,
  'medium' = 64,
  'large' = 128,
}

const iconInitialConfig: Omit<Required<IconConfig>, 'section'> = {
  startHidden: true,
  image: '',
  width: 128,
  height: 128,
  xOffset: 0,
  yOffset: 0,
} as const

/**
 * Displays an icon in the bottom-left corner.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=128] image width
 * @param {number} [height=128] image height
 * @param {number} [xOffset=0] offset on X
 * @param {number} [yOffset=0] offset on Y
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class Icon extends UIObject {
  public imageElement: IconImageElement

  public image: string
  public width: number
  public height: number
  public xOffset: number
  public yOffset: number
  public section: ImageAtlasData | undefined

  constructor({
    section,
    initial = iconInitialConfig,
    startHidden = initial.startHidden,
    image = initial.image,
    width = initial.width,
    height = initial.height,
    xOffset = initial.xOffset,
    yOffset = initial.yOffset,
  }: IconConfig & IconInitialConfig) {
    super({ startHidden })

    this.image = image
    this.width = width * scaleFactor
    this.height = height * scaleFactor
    this.xOffset = xOffset * scaleFactor
    this.yOffset = yOffset * scaleFactor
    if (section) this.section = section

    this.imageElement = {
      uiBackground: {
        textureMode: 'stretch',
      },
      uiTransform: {
        positionType: 'absolute',
      },
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiBackground={{
          ...this.imageElement.uiBackground,
          texture: {
            src: this.image,
          },
          uvs: getImageAtlasMapping(this.section),
        }}
        uiTransform={{
          ...this.imageElement.uiTransform,
          width: this.width,
          height: this.height,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this.yOffset, right: this.xOffset * -1 },
        }}
      />
    )
  }
}

const smallIconInitialConfig: Omit<Required<IconConfig>, 'section'> = {
  startHidden: true,
  image: '',
  width: IconSize.small,
  height: IconSize.small,
  xOffset: -30,
  yOffset: 50,
} as const

/**
 * Displays an icon of 32x32 in the bottom-left corner.
 *
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=32] image width
 * @param {number} [height=32] image height
 * @param {number} [xOffset=-30] offset on X
 * @param {number} [yOffset=50] offset on Y
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class SmallIcon extends Icon {
  constructor(config: IconConfig) {
    super({ ...config, initial: smallIconInitialConfig })
  }
}

const mediumIconInitialConfig: Omit<Required<IconConfig>, 'section'> = {
  startHidden: true,
  image: '',
  width: IconSize.medium,
  height: IconSize.medium,
  xOffset: -30,
  yOffset: 50,
} as const

/**
 * Displays an icon of 64x64 in the bottom-left corner.
 *
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=64] image width
 * @param {number} [height=64] image height
 * @param {number} [xOffset=-30] offset on X
 * @param {number} [yOffset=50] offset on Y
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class MediumIcon extends Icon {
  constructor(config: IconConfig) {
    super({ ...config, initial: mediumIconInitialConfig })
  }
}

const largeIconInitialConfig: Omit<Required<IconConfig>, 'section'> = {
  startHidden: true,
  image: '',
  width: IconSize.large,
  height: IconSize.large,
  xOffset: -30,
  yOffset: 50,
} as const

/**
 * Displays an icon of 128x128 in the bottom-left corner.
 *
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=128] image width
 * @param {number} [height=128] image height
 * @param {number} [xOffset=-30] offset on X
 * @param {number} [yOffset=50] offset on Y
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class LargeIcon extends Icon {
  constructor(config: IconConfig) {
    super({ ...config, initial: largeIconInitialConfig })
  }
}
