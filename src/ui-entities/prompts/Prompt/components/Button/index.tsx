import ReactEcs, { Callback, EntityPropTypes, Label, UiEntity, UiLabelProps } from '@dcl/sdk/react-ecs'
// import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'
import { Color4 } from '@dcl/sdk/math'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
// import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
import { InputAction, UiText } from '@dcl/sdk/ecs'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { SystemInputActions } from '../../../../../utils/systemInputActionsUtils'
import { getImageAtlasMapping } from '../../../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../../../constants/resources'
import { defaultFont } from '../../../../../constants/font'
import { scaleFactor } from '../../../../../utils/scaleFactor'

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
  BUTTONECORNER = `buttonECorner`,
  BUTTONEEDGE = `buttonEEdge`,
  BUTTONFCORNER = `buttonFCorner`,
  BUTTONFEDGE = `buttonFEdge`,
}

export type PromptButtonConfig = InPromptUIObjectConfig & {
  text: string | number
  xPosition?: number
  yPosition?: number
  positionAbsolute?: boolean
  onMouseDown: Callback
  style?: PromptButtonStyles
  buttonSize?: number | 'auto'
}

const promptButtonInitialConfig: Omit<Required<PromptButtonConfig>, 'parent'> = {
  startHidden: false,
  text: '',
  xPosition: 0,
  yPosition: 0,
  positionAbsolute: false,
  onMouseDown: () => { },
  style: PromptButtonStyles.ROUNDSILVER,
  buttonSize: 'auto'
} as const

/**
 * Prompt button
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [text=''] label text
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {boolean} [positionAbsolute=true] Position by absolute
 * @param {Callback} [onMouseDown=0] click action
 * @param {PromptButtonStyles} [style=CloseIconStyles.ROUNDSILVER] visible variant
 *
 */
export class PromptButton extends InPromptUIObject {
  public labelElement: PromptButtonLabelElementProps
  public imageElement: () =>  PromptButtonImageElementProps
  public imageElementCorner: () => PromptButtonImageElementProps
  public imageElementEdge: () => PromptButtonImageElementProps
  public iconElement: () => PromptButtonIconElementProps

  public text: string | number
  public xPosition: number
  public yPosition: number
  public positionAbsolute: boolean
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
    positionAbsolute = promptButtonInitialConfig.positionAbsolute,
    onMouseDown = promptButtonInitialConfig.onMouseDown,
    style = promptButtonInitialConfig.style,
    buttonSize = promptButtonInitialConfig.buttonSize,
  }: PromptButtonConfig) {
    super({
      startHidden,
      parent,
    })

    this.text = text
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.positionAbsolute = positionAbsolute,
    this.onMouseDown = onMouseDown

    this._style = style

    this._disabled = false

    this._isEStyle = this._style === PromptButtonStyles.E
    this._isFStyle = this._style === PromptButtonStyles.F


    this._width = 174
    this._height = 46

    let buttonImg: PromptButtonCustomBgStyles | PromptButtonStyles = this._style
    let buttonImgCorn: PromptButtonCustomBgStyles | PromptButtonStyles = this._style
    let buttonImgEdge: PromptButtonCustomBgStyles | PromptButtonStyles = this._style


    let labelXOffset: number = 0

    if (this._isEStyle) {
      buttonImg = PromptButtonCustomBgStyles.BUTTONE
      buttonImgCorn = PromptButtonCustomBgStyles.BUTTONECORNER
      buttonImgEdge = PromptButtonCustomBgStyles.BUTTONEEDGE
      labelXOffset = 25 * scaleFactor
    }

    if (this._isFStyle) {
      buttonImg = PromptButtonCustomBgStyles.BUTTONF
      buttonImgCorn = PromptButtonCustomBgStyles.BUTTONFCORNER
      buttonImgEdge = PromptButtonCustomBgStyles.BUTTONFEDGE
      labelXOffset = 25 * scaleFactor
    }

    this._labelDisabledColor = Color4.Gray()
    this._labelColor =
      this._style == PromptButtonStyles.ROUNDWHITE || this._style == PromptButtonStyles.SQUAREWHITE
        ? Color4.Black()
        : Color4.White()

    this.labelElement = {}

    this.imageElement = () => ( {
      uiTransform: {
        justifyContent: 'flex-end',
        width: typeof (buttonSize) == 'number' ? buttonSize as number * scaleFactor : 'auto',
        height: this._height * scaleFactor,
        margin: { top: 30 * scaleFactor, bottom: 30 * scaleFactor, left:  5 * scaleFactor, right: 5 * scaleFactor },
        maxWidth: 300 * scaleFactor,
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
    })

    this.imageElementCorner = () => ({
      uiTransform: {
        height: this._height * scaleFactor ,
        width: 12 * scaleFactor
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
        uvs: getImageAtlasMapping({
          ...sourcesComponentsCoordinates.buttons[buttonImgCorn],
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }),
      },
    })

    this.imageElementEdge = () => ({
      uiTransform: {
        height: this._height * scaleFactor,
        width: 12 * scaleFactor,
        margin: { right: 10 * scaleFactor }
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
        uvs: getImageAtlasMapping({
          ...sourcesComponentsCoordinates.buttons[buttonImgEdge],
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }),
      },
    })

    this.iconElement = () => ({
      uiTransform: {
        width: 26 * scaleFactor,
        height: 26 * scaleFactor,
        alignSelf: 'flex-start',
        justifyContent: "center",
        position: {
          top: '50%',
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
    })

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
    this._xPosition = this.promptWidth / -2 + this._width * scaleFactor / 2 + (this.xPosition * scaleFactor)
    this._yPosition = this.promptHeight / 2 + this._height * scaleFactor / -2 + (this.yPosition * scaleFactor)

    return (
      <UiEntity
        key={key}
        uiTransform={
          (!this.positionAbsolute)
            ? {
              ...this.imageElement().uiTransform,
              display: this.visible ? 'flex' : 'none',
            }
            : {
              ...this.imageElement().uiTransform,
              display: this.visible ? 'flex' : 'none',
              position: { bottom: this._yPosition, right: this._xPosition * -1 },
              positionType: 'absolute'
            }}
        onMouseDown={() => {
          console.log('prompt button onMouseDown_________________')
          this._click()
        }}
      >
        <UiEntity {...this.imageElementCorner()}/>
        <UiEntity
          {...this.imageElement()}
          uiTransform={{
            display: this.visible ? 'flex' : 'none',
          }}
        >
          <UiEntity
            {...this.iconElement()}
            uiTransform={{
              ...this.iconElement().uiTransform,
              display: this._disabled || (!this._isEStyle && !this._isFStyle) ? 'none' : 'flex',
              margin: {
                top: -26 / 2 * scaleFactor,
                right: 5 * scaleFactor
              },
            }}
          />
          <UiEntity
            uiTransform={{
              width: 'auto',
              maxWidth: 255 * scaleFactor,
              overflow: 'hidden',
            }}
            uiText={{
              value: String(this.text),
              color: this._disabled ? this._labelDisabledColor : this.labelElement.color || this._labelColor,
              fontSize: 24 * scaleFactor,
              font: defaultFont,
              textAlign: 'middle-left',
              textWrap: 'nowrap'
            }}
          />
        </UiEntity>
        <UiEntity {...this.imageElementEdge()}/>
      </UiEntity>
    )
  }

  private _click = (): void => {
    if (this._disabled || !this.visible || !this.isPromptVisible) return


    console.log('prompt button _click_________________')

    this.onMouseDown()
  }

  private _buttonIconPos(textLen: number): number {
    let pos = -20  * scaleFactor - textLen * 4 * scaleFactor
    return pos > -65  * scaleFactor ? pos : -65  * scaleFactor
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
