import ReactEcs, { EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { DelayedHidingUIObject, DelayedHidingUIObjectConfig } from '../UIObject'

import { getImageAtlasMapping } from '../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../constants/resources'
import { scaleFactor } from '../../utils/scaleFactor'

export type LoadingImageElement = Omit<EntityPropTypes, 'uiTransform' | 'uiBackground'> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'display' | 'margin' | 'width' | 'height'
  >
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'texture' | 'uvs'>
}

type LoadingConfig = DelayedHidingUIObjectConfig & {
  duration?: number
  xOffset?: number
  yOffset?: number
  scale?: number
}

type LoadingSizeConfig = {
  width: number
  height: number
}

const loadingInitialConfig: Required<LoadingConfig & LoadingSizeConfig> = {
  startHidden: true,
  duration: 0,
  xOffset: 0,
  yOffset: 0,
  width: 50,
  height: 66,
  scale: 1,
} as const

/**
 * Displays a loading icon in the center of the screen
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} [duration=0] duration time to keep the icon visible (in seconds) if starting visible
 * @param {number} [xOffset=0] offset on X
 * @param {number} [yOffset=0] offset on Y
 * @param {number} [scale=1] multiplier for the size of the bar. 1 = 50 x 66
 *
 */
export class Loading extends DelayedHidingUIObject {
  public imageElement: LoadingImageElement

  public xOffset: number
  public yOffset: number
  public scale: number

  private _width: number | undefined
  private _height: number | undefined

  constructor({
    startHidden = loadingInitialConfig.startHidden,
    duration = loadingInitialConfig.duration,
    xOffset = loadingInitialConfig.xOffset,
    yOffset = loadingInitialConfig.yOffset,
    scale = loadingInitialConfig.scale,
  }: LoadingConfig) {
    super({ startHidden, duration })

    this.xOffset = xOffset * scaleFactor
    this.yOffset = yOffset * scaleFactor
    this.scale = scale * scaleFactor

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
    this._width = loadingInitialConfig.width * this.scale
    this._height = loadingInitialConfig.height * this.scale

    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiBackground={{
          ...this.imageElement.uiBackground,
          texture: {
            src: AtlasTheme.ATLAS_PATH_LIGHT,
          },
          uvs: getImageAtlasMapping({
            ...sourcesComponentsCoordinates.icons['TimerLarge'],
            atlasHeight: sourcesComponentsCoordinates.atlasHeight,
            atlasWidth: sourcesComponentsCoordinates.atlasWidth,
          }),
        }}
        uiTransform={{
          ...this.imageElement.uiTransform,
          width: this._width,
          height: this._height,
          display: this.visible ? 'flex' : 'none',
          margin: {
            top: this.yOffset * -1 - this._height / 2,
            left: this.xOffset - this._width / 2,
          },
        }}
      />
    )
  }
}
