import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { UIObject, UIObjectConfig } from '../UIObject'

import { defaultFont } from '../../constants/font'

export type CornerLabelTextElement = Omit<UiLabelProps, 'value' | 'fontSize' | 'color'> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'display' | 'position'>
  }

export type CornerLabelConfig = UIObjectConfig & {
  value: string | number
  xOffset?: number
  yOffset?: number
  color?: Color4
  size?: number
}

const cornerLabelInitialConfig: Required<CornerLabelConfig> = {
  startHidden: true,
  value: '',
  xOffset: -40,
  yOffset: 70,
  color: Color4.White(),
  size: 25,
} as const

/**
 * Displays a text on center of the UI.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [xOffset=-40] offset on X
 * @param {number} [yOffset=70] offset on Y
 * @param {Color4} [color=Color4.White()] text color
 * @param {number} [size=25] text size
 *
 */
export class CornerLabel extends UIObject {
  public textElement: CornerLabelTextElement

  public xOffset: number
  public yOffset: number
  public color: Color4
  public size: number

  private _value: string | number

  constructor({
    startHidden = cornerLabelInitialConfig.startHidden,
    value = cornerLabelInitialConfig.value,
    xOffset = cornerLabelInitialConfig.xOffset,
    yOffset = cornerLabelInitialConfig.yOffset,
    color = cornerLabelInitialConfig.color,
    size = cornerLabelInitialConfig.size,
  }: CornerLabelConfig) {
    super({ startHidden })

    this.xOffset = xOffset
    this.yOffset = yOffset
    this.color = color
    this.size = size

    this._value = value

    this.textElement = {
      textAlign: 'bottom-right',
      font: defaultFont,
      uiTransform: {
        positionType: 'absolute',
      },
    }
  }

  /**
   * Sets the label's value to a new string.
   *
   * @param {string | number} [newValue=''] New value for the label
   *
   */
  public set(newValue: string | number = ''): void {
    this._value = newValue
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <Label
        key={key}
        {...this.textElement}
        color={this.color}
        fontSize={this.size}
        value={String(this._value)}
        uiTransform={{
          ...this.textElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this.yOffset, right: this.xOffset * -1 },
        }}
      />
    )
  }
}
