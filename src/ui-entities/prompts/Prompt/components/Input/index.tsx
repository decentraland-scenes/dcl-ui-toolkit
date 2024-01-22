import ReactEcs, { Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiInputProps } from '@dcl/react-ecs/dist/components/Input/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { defaultFont } from '../../../../../constants/font'

export type PromptInputFillInBoxElementProps = Partial<
  Omit<UiInputProps, 'onChange' | 'placeholder'>
> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'position' | 'display'>
  }

export type PromptInputConfig = InPromptUIObjectConfig & {
  placeholder?: string | number
  xPosition: number
  yPosition: number
  onChange?: (value: string) => void
}

const promptInputInitialConfig: Omit<Required<PromptInputConfig>, 'parent'> = {
  startHidden: false,
  placeholder: 'Fill in',
  xPosition: 0,
  yPosition: 0,
  onChange: () => {},
} as const

/**
 * Prompt input box
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [placeholder='Fill in'] Default string to display in the box
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {() => void} onChange Function to call every time the value in the text box is modified by the player
 *
 */
export class PromptInput extends InPromptUIObject {
  public fillInBoxElement: PromptInputFillInBoxElementProps

  public placeholder: string | number
  public xPosition: number
  public yPosition: number
  public onChange: (value: string) => void

  private _xPosition: number | undefined
  private _yPosition: number | undefined
  private readonly _width: number
  private readonly _height: number

  constructor({
    parent,
    startHidden = promptInputInitialConfig.startHidden,
    placeholder = promptInputInitialConfig.placeholder,
    xPosition = promptInputInitialConfig.xPosition,
    yPosition = promptInputInitialConfig.yPosition,
    onChange = promptInputInitialConfig.onChange,
  }: PromptInputConfig) {
    super({
      startHidden,
      parent,
    })

    this._width = 312
    this._height = 46

    this.placeholder = placeholder
    this.xPosition = xPosition
    this.yPosition = yPosition

    this.onChange = onChange

    this.fillInBoxElement = {
      uiTransform: {
        width: this._width,
        height: this._height,
      },
      fontSize: 22,
      textAlign: 'middle-center',
      font: defaultFont,
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {

    return (
      <Input
        key={key}
        {...this.fillInBoxElement}
        placeholder={String(this.placeholder)}
        color={this.fillInBoxElement.color || (this.isDarkTheme ? Color4.White() : Color4.Black())}
        uiTransform={{
          ...this.fillInBoxElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: {left: this.xPosition, top: this.yPosition}
        }}
        onChange={this.onChange}
      />
    )
  }
}
