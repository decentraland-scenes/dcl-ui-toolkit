import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { getImageAtlasMapping } from '../../../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../../../constants/resources'
import { defaultFont } from '../../../../../constants/font'

export type PromptCheckboxLabelElementProps = EntityPropTypes & Omit<UiLabelProps, 'value'>

export type PromptCheckboxImageElementProps = Omit<
  EntityPropTypes,
  'uiTransform' | 'uiBackground'
> & {
  uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'width' | 'height'>
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'>
}

export type PromptCheckboxConfig = InPromptUIObjectConfig & {
  text: string | number
  xPosition: number
  yPosition: number
  onCheck?: () => void
  onUncheck?: () => void
  large?: boolean
  startChecked?: boolean
}

const promptCheckboxInitialConfig: Omit<Required<PromptCheckboxConfig>, 'parent'> = {
  startHidden: false,
  text: '',
  xPosition: 0,
  yPosition: 0,
  onCheck: () => {},
  onUncheck: () => {},
  large: false,
  startChecked: false,
} as const

/**
 * Prompt checkbox
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} [text=''] Text to display on the right of the box
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {() => void} onCheck Function to call every time the box is checked
 * @param {() => void} onUncheck Function to call every time the box is unchecked
 * @param {boolean} [large=false] Makes the checkbox significantly larger
 * @param {boolean} [startChecked=false] Starts the checkbox in a default state of already checked
 *
 */
export class PromptCheckbox extends InPromptUIObject {
  public imageElement: PromptCheckboxImageElementProps
  public labelElement: PromptCheckboxLabelElementProps

  public text: string | number
  public xPosition: number
  public yPosition: number
  public large: boolean
  public startChecked: boolean
  public onUncheck: () => void
  public onCheck: () => void

  private _checked: boolean
  private _xPosition: number | undefined
  private _yPosition: number | undefined

  constructor({
    parent,
    startHidden = promptCheckboxInitialConfig.startHidden,
    text = promptCheckboxInitialConfig.text,
    xPosition = promptCheckboxInitialConfig.xPosition,
    yPosition = promptCheckboxInitialConfig.yPosition,
    large = promptCheckboxInitialConfig.large,
    startChecked = promptCheckboxInitialConfig.startChecked,
    onUncheck = promptCheckboxInitialConfig.onUncheck,
    onCheck = promptCheckboxInitialConfig.onCheck,
  }: PromptCheckboxConfig) {
    super({
      startHidden,
      parent,
    })

    this.text = text
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.large = large
    this.startChecked = startChecked
    this.onUncheck = onUncheck
    this.onCheck = onCheck

    this._checked = this.startChecked

    this.onCheck = onCheck
    this.onUncheck = onUncheck

    this.imageElement = {
      uiTransform: {
        margin: {
          right: 5,
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
      fontSize: 20,
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
    this._yPosition = this.promptHeight / 2 + 32 / -2 + this.yPosition

    return (
      <UiEntity
        key={key}
        uiTransform={{
          display: this.visible ? 'flex' : 'none',
          width: '100%',
          height: 32,
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
              ...sourcesComponentsCoordinates.checkboxes[this._getImageStyle()],
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
          uiTransform={{
            ...this.imageElement.uiTransform,
            width: this.large ? 32 : 24,
            height: this.large ? 32 : 24,
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

  private _getImageStyle():
    | 'wLargeOff'
    | 'wLargeOn'
    | 'wOff'
    | 'wOn'
    | 'dLargeOff'
    | 'dLargeOn'
    | 'dOff'
    | 'dOn' {
    if (this.isDarkTheme) {
      if (this.large) {
        return !this._checked ? 'wLargeOff' : 'wLargeOn'
      } else {
        return !this._checked ? 'wOff' : 'wOn'
      }
    } else {
      if (this.large) {
        return !this._checked ? 'dLargeOff' : 'dLargeOn'
      } else {
        return !this._checked ? 'dOff' : 'dOn'
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
