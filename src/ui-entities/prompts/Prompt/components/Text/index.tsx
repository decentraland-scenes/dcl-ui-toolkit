import ReactEcs, { EntityPropTypes, Label, UiLabelProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
// import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { defaultFont } from '../../../../../constants/font'
import { scaleFactor } from '../../../../../utils/scaleFactor'

export type PromptTextTextElementProps = Omit<UiLabelProps, 'value' | 'color' | 'fontSize'> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'display' | 'margin'>
  }

export type PromptTextConfig = InPromptUIObjectConfig & {
  value: string | number
  xPosition?: number
  yPosition?: number
  positionAbsolute?: boolean,
  color?: Color4
  size?: number
}

const promptTextInitialConfig: Omit<Required<PromptTextConfig>, 'parent'> = {
  startHidden: false,
  value: '',
  xPosition: 0,
  yPosition: 0,
  positionAbsolute: true,
  color: Color4.Black(),
  size: 15,
} as const

function lineBreak(text: string, maxLineLength: number): string {
  const words = text.split(' ');
  let currentLine = '';
  const lines = [];

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }
  lines.push(currentLine.trim());
  return lines.join('\n');
}

/**
 * Prompt text
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {boolean} [positionAbsolute=true] Position by absolute
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
  public positionAbsolute: boolean
  public color: Color4 | undefined
  public size: number

  private _xPosition: number | undefined
  private _yPosition: number | undefined

  constructor({
    color,
    parent,
    startHidden = promptTextInitialConfig.startHidden,
    value = promptTextInitialConfig.value,
    xPosition = promptTextInitialConfig.xPosition,
    yPosition = promptTextInitialConfig.yPosition,
    positionAbsolute = promptTextInitialConfig.positionAbsolute,
    size = promptTextInitialConfig.size,
  }: PromptTextConfig) {
    super({
      startHidden,
      parent,
    })

    this.value = value
    this.xPosition = xPosition  * scaleFactor
    this.yPosition = yPosition  * scaleFactor
    this.positionAbsolute = positionAbsolute
    this.color = color
    this.size = size  * scaleFactor

    this.textElement = {
      textAlign: 'middle-center',
      font: defaultFont,
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {

    this._xPosition = this.promptWidth / -2 + this.promptWidth / 2 + this.xPosition
    this._yPosition = this.promptHeight / 2 + 32 / -2 + this.yPosition


    return (
      <Label
        key={key}
        {...this.textElement}
        value={lineBreak(String(this.value), 50)}
        color={this.color || (this.isDarkTheme ? Color4.White() : promptTextInitialConfig.color)}
        fontSize={this.size}
        textAlign='middle-center'
        uiTransform={
          (!this.positionAbsolute)
            ? {display: this.visible ? 'flex' : 'none',
              margin: { top: 20  * scaleFactor, left: 20  * scaleFactor, right: 20  * scaleFactor }, 
              height: 'auto',
              positionType: 'relative',
              alignSelf: 'center', alignContent: 'center'}
            : {display: this.visible ? 'flex' : 'none',
              positionType:'absolute' ,
              position: {  bottom: this._yPosition, right: this._xPosition * -1 }}
        }
      />
    )
  }
}
