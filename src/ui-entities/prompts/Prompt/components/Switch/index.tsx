import ReactEcs, { EntityPropTypes, Label, UiEntity, UiLabelProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
// import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { getImageAtlasMapping } from '../../../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../../../constants/resources'
import { defaultFont } from '../../../../../constants/font'
import { scaleFactor } from '../../../../../utils/scaleFactor'

export type PromptSwitchLabelElementProps = EntityPropTypes & Omit<UiLabelProps, 'value'>

export type PromptSwitchImageElementProps = Omit<EntityPropTypes, 'uiBackground'> & {
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'>
}

export enum PromptSwitchStyles {
  ROUNDGREEN = `roundGreen`,
  ROUNDRED = `roundRed`,
  SQUAREGREEN = `squareGreen`,
  SQUARERED = `squareRed`,
}

export type PromptSwitchConfig = InPromptUIObjectConfig & {
  text: string | number
  xPosition: number
  yPosition: number
  onCheck?: () => void
  onUncheck?: () => void
  startChecked?: boolean
  style?: PromptSwitchStyles
}

const promptSwitchInitialConfig: Omit<Required<PromptSwitchConfig>, 'parent'> = {
  startHidden: false,
  text: '',
  xPosition: 0,
  yPosition: 0,
  onCheck: () => {},
  onUncheck: () => {},
  startChecked: false,
  style: PromptSwitchStyles.ROUNDGREEN,
} as const

/**
 * Prompt switch
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} [text=''] Text to display on the right of the box
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {() => void} onCheck Function to call every time the box is checked
 * @param {() => void} onUncheck Function to call every time the box is unchecked
 * @param {boolean} [startChecked=false] Starts the checkbox in a default state of already checked
 *
 */
export class PromptSwitch extends InPromptUIObject {
  public imageElement: PromptSwitchImageElementProps
  public labelElement: PromptSwitchLabelElementProps

  public text: string | number
  public xPosition: number
  public yPosition: number
  public style: PromptSwitchStyles
  public startChecked: boolean
  public onUncheck: () => void
  public onCheck: () => void

  private _checked: boolean
  private _xPosition: number | undefined
  private _yPosition: number | undefined

  constructor({
    parent,
    startHidden = promptSwitchInitialConfig.startHidden,
    text = promptSwitchInitialConfig.text,
    xPosition = promptSwitchInitialConfig.xPosition,
    yPosition = promptSwitchInitialConfig.yPosition,
    onCheck = promptSwitchInitialConfig.onCheck,
    onUncheck = promptSwitchInitialConfig.onUncheck,
    startChecked = promptSwitchInitialConfig.startChecked,
    style = promptSwitchInitialConfig.style,
  }: PromptSwitchConfig) {
    super({
      startHidden,
      parent,
    })

    this.text = text
    this.xPosition = xPosition * scaleFactor
    this.yPosition = yPosition * scaleFactor
    this.style = style
    this.startChecked = startChecked
    this.onUncheck = onUncheck
    this.onCheck = onCheck

    this._checked = startChecked

    this.imageElement = {
      uiTransform: {
        width: 64 * scaleFactor,
        height: 32 * scaleFactor,
        margin: {
          right: 5 * scaleFactor,
        },
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
      },
    }

    this.labelElement = {
      uiTransform: {
        maxWidth: '100%',
        height: '100%',
      },
      textAlign: 'middle-left',
      font: defaultFont,
      fontSize: 20 * scaleFactor,
    }
  }

  /**
   * Sets the box state to unchecked.
   */
  public uncheck(): void {
    this._checked = false
  }

  /**
   * Sets the box state to checked.
   */
  public check(): void {
    this._checked = true
  }

  public render(key?: string): ReactEcs.JSX.Element {
    this._xPosition = this.promptWidth / -2 + this.promptWidth / 2 + this.xPosition
    this._yPosition = this.promptHeight / 2 + 32 * scaleFactor / -2 + this.yPosition

    return (
      <UiEntity
        key={key}
        uiTransform={{
          display: this.visible ? 'flex' : 'none',
          width: '100%',
          height: 32 * scaleFactor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { bottom: this._yPosition, right: this._xPosition * -1 },
        }}
      >
        <UiEntity
          {...this.imageElement}
          uiBackground={{
            ...this.imageElement.uiBackground,
            uvs: getImageAtlasMapping({
              ...sourcesComponentsCoordinates.switches[this._getImageStyle()],
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
          onMouseDown={this._click}
        />
        <Label
          {...this.labelElement}
          value={String(this.text)}
          color={this.labelElement.color || (this.isDarkTheme ? Color4.White() : Color4.Black())}
        />
      </UiEntity>
    )
  }

  private _getImageStyle(): PromptSwitchStyles | 'roundOff' | 'squareOff' {
    if (this._checked) {
      return this.style
    } else {
      if (
        this.style == PromptSwitchStyles.ROUNDGREEN ||
        this.style == PromptSwitchStyles.ROUNDRED
      ) {
        return 'roundOff'
      } else {
        return 'squareOff'
      }
    }
  }

  private _click = (): void => {
    if (!this._checked) {
      this.check()
      this.onCheck()
    } else {
      this.uncheck()
      this.onUncheck()
    }

    this.imageElement.onMouseDown?.()
  }
}
