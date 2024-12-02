import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { EntityPropTypes, Label, UiLabelProps } from '@dcl/sdk/react-ecs'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
// import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { UIObject, UIObjectConfig } from '../UIObject'

import { toFixedLengthStringUtil } from '../../utils/textUtils'

import { defaultFont } from '../../constants/font'
import { scaleFactor } from '../../utils/scaleFactor'

export type CounterTextElement = Omit<UiLabelProps, 'value' | 'fontSize' | 'color'> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'display' | 'position'>
  }

export type CounterConfig = UIObjectConfig & {
  value: number
  xOffset?: number
  yOffset?: number
  color?: Color4
  size?: number
  fixedDigits?: number
}

const counterInitialConfig: Required<CounterConfig> = {
  startHidden: true,
  value: 0,
  xOffset: -40,
  yOffset: 70,
  color: Color4.White(),
  size: 25,
  fixedDigits: 0,
} as const

/**
 * Displays a number on the bottom-right of the UI.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} [value=0] starting value
 * @param {number} [xOffset=-40] position on X, to enable fitting several counters
 * @param {number} [yOffset=70] position on Y, to enable fitting several counters
 * @param {Color4} [color=Color4.White()] text color
 * @param {number} [size=25] text size
 * @param {boolean} [fixedDigits=0] display a specific amount of digits, regardless of the value, adding preceding 0s
 *
 */
export class Counter extends UIObject {
  public textElement: CounterTextElement

  public xOffset: number
  public yOffset: number
  public color: Color4
  public size: number
  public fixedDigits: number

  private _value: number
  private readonly _valueStep: number

  constructor({
    startHidden = counterInitialConfig.startHidden,
    value = counterInitialConfig.value,
    xOffset = counterInitialConfig.xOffset,
    yOffset = counterInitialConfig.yOffset,
    color = counterInitialConfig.color,
    size = counterInitialConfig.size,
    fixedDigits = counterInitialConfig.fixedDigits,
  }: CounterConfig) {
    super({ startHidden })

    this.xOffset = xOffset * scaleFactor
    this.yOffset = yOffset * scaleFactor
    this.color = color
    this.size = size * scaleFactor
    this.fixedDigits = fixedDigits

    this._value = value

    this._valueStep = 1

    this.textElement = {
      textAlign: 'bottom-right',
      font: defaultFont,
      uiTransform: {
        positionType: 'absolute',
      },
    }
  }

  /**
   * Get the current value of the counter.
   *
   * @return {number} The current value of the counter
   *
   */
  public read(): number {
    return this._value
  }

  public set(value: number): void {
    this._value = value
  }

  /**
   * Increase the value on the counter.
   *
   * @param {number} [amount=1] How much to increase the counter. By default, it increases by 1
   *
   */
  public increase(amount?: number): void {
    this._value += amount ? amount : this._valueStep
  }

  /**
   * Decrease the value on the counter.
   *
   * @param {number} [amount=1] How much to decrease the counter. By default, it decreases by 1
   *
   */
  public decrease(amount?: number): void {
    this._value -= amount ? amount : this._valueStep
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <Label
        key={key}
        {...this.textElement}
        fontSize={this.size}
        color={this.color}
        value={toFixedLengthStringUtil({
          value: this._value,
          fixedDigits: this.fixedDigits,
        })}
        uiTransform={{
          ...this.textElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this.yOffset, right: this.xOffset * -1 },
        }}
      />
    )
  }
}
