import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'
import { Color4 } from '@dcl/sdk/math'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
import { InputAction } from '@dcl/sdk/ecs'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { SystemInputActions } from '../../../../../utils/systemInputActionsUtils'
import { getImageAtlasMapping } from '../../../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../../../constants/resources'
import { defaultFont } from '../../../../../constants/font'

export type PromptButtonLabelElementProps = EntityPropTypes & Omit<UiLabelProps, 'value'>

export type PromptButtonIconElementProps = Omit<EntityPropTypes, 'uiTransform'> & {
  uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'margin' | 'display'>
}

export type PromptButtonImageElementProps = Omit<EntityPropTypes, 'uiTransform' | 'onMouseDown'> & {
  uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'position' | 'display'>
}

export enum PromptButtonStyles {
  E = `E`,
  F = `F`,
  DARK = `dark`,
  RED = `red`,
  ROUNDBLACK = `roundBlack`,
  ROUNDWHITE = `roundWhite`,
  ROUNDSILVER = `roundSilver`,
  ROUNDGOLD = `roundGold`,
  SQUAREBLACK = `squareBlack`,
  SQUAREWHITE = `squareWhite`,
  SQUARESILVER = `squareSilver`,
  SQUAREGOLD = `squareGold`,
}

enum PromptButtonCustomBgStyles {
  BUTTONE = `buttonE`,
  BUTTONF = `buttonF`,
}

export type PromptButtonConfig = InPromptUIObjectConfig & {
  text: string | number
  xPosition: number
  yPosition: number
  onMouseDown: Callback
  style?: PromptButtonStyles
}

const promptButtonInitialConfig: Omit<Required<PromptButtonConfig>, 'parent'> = {
  startHidden: false,
  text: '',
  xPosition: 0,
  yPosition: 0,
  onMouseDown: () => {},
  style: PromptButtonStyles.ROUNDSILVER,
} as const

/**
 * Prompt button
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [text=''] label text
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {Callback} [onMouseDown=0] click action
 * @param {PromptButtonStyles} [style=CloseIconStyles.ROUNDSILVER] visible variant
 *
 */
export class PromptButton extends InPromptUIObject {
  public labelElement: PromptButtonLabelElementProps
  public imageElement: PromptButtonImageElementProps
  public iconElement: PromptButtonIconElementProps

  public text: string | number
  public xPosition: number
  public yPosition: number
  public onMouseDown: Callback

  private _xPosition: number | undefined
  private _yPosition: number | undefined
  private readonly _width: number
  private readonly _height: number
  private _disabled: boolean
  private readonly _labelColor: Color4
  private readonly _labelDisabledColor: Color4
  private readonly _style: PromptButtonStyles
  private readonly _isEStyle: boolean
  private readonly _isFStyle: boolean
  private _buttonSystemInputAction: SystemInputActions | undefined

  constructor({
    parent,
    startHidden = promptButtonInitialConfig.startHidden,
    text = promptButtonInitialConfig.text,
    xPosition = promptButtonInitialConfig.xPosition,
    yPosition = promptButtonInitialConfig.yPosition,
    onMouseDown = promptButtonInitialConfig.onMouseDown,
    style = promptButtonInitialConfig.style,
  }: PromptButtonConfig) {
    super({
      startHidden,
      parent,
    })

    this.text = String(text).slice(0, 16)
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.onMouseDown = onMouseDown

    this._style = style

    this._disabled = false

    this._isEStyle = this._style === PromptButtonStyles.E
    this._isFStyle = this._style === PromptButtonStyles.F

    this._width = 174
    this._height = 46

    let buttonImg: PromptButtonCustomBgStyles | PromptButtonStyles = this._style
    let labelXOffset: number = 0

    if (this._isEStyle) {
      buttonImg = PromptButtonCustomBgStyles.BUTTONE
      labelXOffset = 25
    }

    if (this._isFStyle) {
      buttonImg = PromptButtonCustomBgStyles.BUTTONF
      labelXOffset = 25
    }

    this._labelDisabledColor = Color4.Gray()
    this._labelColor =
      this._style == PromptButtonStyles.ROUNDWHITE || this._style == PromptButtonStyles.SQUAREWHITE
        ? Color4.Black()
        : Color4.White()

    this.labelElement = {
      font: defaultFont,
      fontSize: 20,
      textAlign: 'middle-center',
      uiTransform: {
        width: '100%',
        height: '100%',
        margin: {
          left: labelXOffset,
        },
      },
    }

    this.imageElement = {
      uiTransform: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: this._width + String(text).length * 2,
        height: this._height,
        positionType: 'absolute',
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
        uvs: getImageAtlasMapping({
          ...sourcesComponentsCoordinates.buttons[buttonImg],
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }),
      },
    }

    this.iconElement = {
      uiTransform: {
        width: 26,
        height: 26,
        positionType: 'absolute',
        position: {
          top: '50%',
          left: String(text).length > 12 ? '40%' : '45%',
        },
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
        uvs: getImageAtlasMapping({
          ...sourcesComponentsCoordinates.buttons[this._style],
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }),
      },
    }

    this._createSystemInputAction()
  }

  public show(): void {
    super.show()

    this._createSystemInputAction()
  }

  public hide(): void {
    super.hide()

    this._clearSystemInputAction()
  }

  public grayOut(): void {
    this._disabled = true
  }

  public enable(): void {
    this._disabled = false
  }

  public render(key?: string): ReactEcs.JSX.Element {
    this._xPosition = this.promptWidth / -2 + this._width / (String(this.text).length > 10 ? 1.4 : 2) + this.xPosition
    this._yPosition = this.promptHeight / 2 + this._height / -2 + this.yPosition

    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiTransform={{
          ...this.imageElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this._yPosition, right: this._xPosition * (String(this.text).length > 10 ? -1.2 : -1)},
        }}
        onMouseDown={() => {
          console.log('prompt button onMouseDown_________________')
          this._click()
        }}
      >
        <UiEntity
          {...this.iconElement}
          uiTransform={{
            ...this.iconElement.uiTransform,
            display: this._disabled || (!this._isEStyle && !this._isFStyle) ? 'none' : 'flex',
            margin: {
              top: -26 / 2,
              left: this._buttonIconPos(String(this.text).length) - 26 / 2,
            },
          }}
        />
        <Label
          {...this.labelElement}
          value={String(this.text)}
          color={
            this._disabled ? this._labelDisabledColor : this.labelElement.color || this._labelColor
          }
        />
      </UiEntity>
    )
  }

  private _click = (): void => {
    if (this._disabled || !this.visible || !this.isPromptVisible) return

    console.log('prompt button _click_________________')

    this.onMouseDown()
  }

  private _buttonIconPos(textLen: number): number {
    let pos = -20 - textLen * 4
    return pos > -65 ? pos : -65
  }

  private _createSystemInputAction(): void {
    if (!this.visible || (!this._isEStyle && !this._isFStyle)) return

    this._buttonSystemInputAction = new SystemInputActions({
      inputAction: this._isEStyle ? InputAction.IA_PRIMARY : InputAction.IA_SECONDARY,
      callback: this._click,
    })

    this._buttonSystemInputAction.add()
  }

  private _clearSystemInputAction(): void {
    this._buttonSystemInputAction?.remove()
  }
}
