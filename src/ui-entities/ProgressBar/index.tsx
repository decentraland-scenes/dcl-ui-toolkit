import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { UIObject, UIObjectConfig } from '../UIObject'

import { getImageAtlasMapping } from '../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../constants/resources'

export type ProgressBarBarElement = Omit<EntityPropTypes, 'uiTransform'> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'display' | 'position' | 'width' | 'height'
  >
}

export type ProgressBarBackgroundElement = Omit<EntityPropTypes, 'uiBackground'> & {
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'>
}

export type ProgressBarProcessElement = Omit<EntityPropTypes, 'uiTransform' | 'uiBackground'> & {
  uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'position' | 'width' | 'height'>
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'color' | 'uvs'>
}

export enum BarStyles {
  ROUNDBLACK = `roundBlack`,
  ROUNDWHITE = `roundWhite`,
  ROUNDSILVER = `roundSilver`,
  ROUNDGOLD = `roundGold`,
  SQUAREBLACK = `squareBlack`,
  SQUAREWHITE = `squareWhite`,
  SQUARESILVER = `squareSilver`,
  SQUAREGOLD = `squareGold`,
}

export type ProgressBarConfig = UIObjectConfig & {
  value: number
  scale?: number
  color?: Color4
  xOffset?: number
  yOffset?: number
  style?: BarStyles
}

const progressBarInitialConfig: Required<ProgressBarConfig> = {
  startHidden: true,
  value: 0,
  scale: 1,
  color: Color4.Red(),
  xOffset: -30,
  yOffset: 60,
  style: BarStyles.ROUNDSILVER,
} as const

/**
 * Displays a colored bar that can be filled up and updated to different values.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} [value=0] starting value
 * @param {number} [xOffset=-30] offset on X
 * @param {number} [yOffset=60] offset on Y
 * @param {Color4} [fillColor=Color4.Red()] color of the bar
 * @param {BarStyles} [style=BarStyles.ROUNDSILVER] margin style of the bar, from the BarStyles enum
 * @param {number} [scale=1] multiplier for the size of the bar. 1 = 128 x 32
 *
 */
export class ProgressBar extends UIObject {
  public barElement: ProgressBarBarElement
  public backgroundElement: ProgressBarBackgroundElement
  public processElement: ProgressBarProcessElement

  public scale: number
  public xOffset: number
  public yOffset: number
  public color: Color4
  public style: BarStyles

  private _value: number

  private readonly _valueMax: number
  private readonly _valueMin: number
  private readonly _valueChangeStep: number

  private _width: number | undefined
  private _height: number | undefined

  private _progressHeight: number | undefined
  private _progressPaddingTop: number | undefined
  private _progressPaddingBottom: number | undefined
  private _progressPaddingLeft: number | undefined
  private _progressPaddingRight: number | undefined

  constructor({
    startHidden = progressBarInitialConfig.startHidden,
    value = progressBarInitialConfig.value,
    scale = progressBarInitialConfig.scale,
    color = progressBarInitialConfig.color,
    xOffset = progressBarInitialConfig.xOffset,
    yOffset = progressBarInitialConfig.yOffset,
    style = progressBarInitialConfig.style,
  }: ProgressBarConfig) {
    super({ startHidden })

    this.scale = scale
    this.color = color
    this.xOffset = xOffset
    this.yOffset = yOffset
    this.style = style

    this._value = value

    this._valueMax = 1
    this._valueMin = 0
    this._valueChangeStep = 0.1

    this.barElement = {
      uiTransform: {
        positionType: 'absolute',
      },
    }

    this.backgroundElement = {
      uiTransform: {
        width: '100%',
        height: '100%',
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
      },
    }

    this.processElement = {
      uiTransform: {
        positionType: 'absolute',
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
      },
    }
  }

  /**
   * Get the current value of the bar
   *  * @return {number} The current value of the bar, as a value from 0 to 1
   *
   */
  public read(): number {
    return this._value
  }

  /**
   * Sets the bar's value to a specific amount, regardless of what it was before.
   *
   * @param {number} amount New value for the bar, between 0 and 1
   *
   */
  public set(amount: number): void {
    this._setValueInRange(amount)
  }

  /**
   * Increase the value on the bar.
   *
   * @param {number} [amount=0.1] How much to increase the bar, up to a maximum of 1. By default, it increases by 0.1
   *
   */
  public increase(amount?: number): void {
    this._setValueInRange(this._value + (amount ? amount : this._valueChangeStep))
  }

  /**
   * Decrease the value on the bar.
   *
   * @param {number} [amount=0.1] How much to decrease the bar, down to a minimum of 0. By default, it decreases by 0.1
   *
   */
  public decrease(amount?: number): void {
    this._setValueInRange(this._value - (amount ? amount : this._valueChangeStep))
  }

  public render(key?: string): ReactEcs.JSX.Element {
    this._width = 128 * this.scale
    this._height = 32 * this.scale

    const isNotDefaultBorders =
      this.style === BarStyles.ROUNDWHITE ||
      this.style === BarStyles.ROUNDBLACK ||
      this.style === BarStyles.SQUAREWHITE ||
      this.style === BarStyles.SQUAREBLACK

    this._progressPaddingTop = (isNotDefaultBorders ? 3 : 2) * this.scale
    this._progressPaddingBottom = (isNotDefaultBorders ? 3 : 4) * this.scale
    this._progressPaddingLeft = (isNotDefaultBorders ? 3 : 2) * this.scale
    this._progressPaddingRight = (isNotDefaultBorders ? 3 : 2) * this.scale
    this._progressHeight = this._height - this._progressPaddingTop - this._progressPaddingBottom

    return (
      <UiEntity
        key={key}
        {...this.barElement}
        uiTransform={{
          ...this.barElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this.yOffset, right: this.xOffset * -1 },
          width: this._width,
          height: this._height,
        }}
      >
        <UiEntity
          {...this.backgroundElement}
          uiBackground={{
            ...this.backgroundElement.uiBackground,
            uvs: getImageAtlasMapping({
              ...sourcesComponentsCoordinates.buttons[this.style],
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
        />
        <UiEntity
          {...this.processElement}
          uiTransform={{
            ...this.processElement.uiTransform,
            width:
              this._width * this._value - this._progressPaddingLeft - this._progressPaddingRight,
            height: this._progressHeight,
            position: {
              top: this._progressPaddingTop,
              left: this._progressPaddingLeft,
            },
          }}
          uiBackground={{
            ...this.processElement.uiBackground,
            color: this.color,
            uvs: getImageAtlasMapping({
              ...sourcesComponentsCoordinates.buttons[
                this.style.startsWith('round') ? 'roundWhite' : 'squareWhite'
              ],
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
        />
      </UiEntity>
    )
  }

  private _setValueInRange(value: number): void {
    this._value =
      value > this._valueMax ? this._valueMax : value < this._valueMin ? this._valueMin : value
  }
}
