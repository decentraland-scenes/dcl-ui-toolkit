import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { defaultFont } from '../../../../../constants/font'

export type PromptTextTextElementProps = Omit<UiLabelProps, 'value' | 'color' | 'fontSize'> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'display' | 'margin'>
  }

export type PromptTextConfig = InPromptUIObjectConfig & {
  value: string | number
  xPosition: number
  yPosition: number
  color?: Color4
  size?: number
}

const promptTextInitialConfig: Omit<Required<PromptTextConfig>, 'parent'> = {
  startHidden: false,
  value: '',
  xPosition: 0,
  yPosition: 0,
  color: Color4.Black(),
  size: 15,
} as const

/**
 * Prompt text
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {boolean} [darkTheme=false] prompt color style
 * @param {Color4} [color=Color4.Black()] text color
 * @param {number} [size=15] text size
 *
 */
export class PromptText extends InPromptUIObject {
  public textElement: PromptTextTextElementProps

  public value: string | number
  public xPosition: number
  public yPosition: number
  public color: Color4 | undefined
  public size: number

  constructor({
    color,
    parent,
    startHidden = promptTextInitialConfig.startHidden,
    value = promptTextInitialConfig.value,
    xPosition = promptTextInitialConfig.xPosition,
    yPosition = promptTextInitialConfig.yPosition,
    size = promptTextInitialConfig.size,
  }: PromptTextConfig) {
    super({
      startHidden,
      parent,
    })

    this.value = value
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.color = color
    this.size = size

    this.textElement = {
      uiTransform: {
        height: 'auto',
      },
      textAlign: 'middle-center',
      font: defaultFont,
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <Label
        key={key}
        {...this.textElement}
        value={String(this.value)}
        color={this.color || (this.isDarkTheme ? Color4.White() : promptTextInitialConfig.color)}
        fontSize={this.size}
        uiTransform={{
          ...this.textElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
        }}
      />
    )
  }
}
