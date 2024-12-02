import ReactEcs, { Dropdown, EntityPropTypes, Label, UiEntity, UiLabelProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
// import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
// import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
import { scaleFactor } from '../../../../../utils/scaleFactor'
import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'
import { defaultFont } from '../../../../../constants/font'

export type PromptDropdownLabelElementProps = EntityPropTypes & Omit<UiLabelProps, 'value'>

// export type PromptDropdownImageElementProps = Omit<
//   EntityPropTypes,
//   'uiTransform' | 'uiBackground'
// > & {
//   uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'width' | 'height'>
//   uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'>
// }

export type PromptDropdownConfig = InPromptUIObjectConfig & {
  // startHidden: boolean,
  label: string
  options: readonly string[]
  xPosition?: number
  yPosition?: number
  onChange?: (index:number) => void
  large?: boolean
  defaultValue?: number
  positionAbsolute?: boolean
}

const promptDropdownInitialConfig: Omit<Required<PromptDropdownConfig>, 'parent'> = {
  startHidden: false,
  label: "",
  options: [],
  xPosition: 0,
  yPosition: 0,
  onChange: (index:number) => {},
  large: false,
  defaultValue: 0,
  positionAbsolute: false,
} as const

/**
 * Prompt dropdown
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string[]} [options=[""]] List of strings with possible values
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {(index:number) => void} onChange Function to call every time a new value is selected. The selected value index is passed as a parameter.
 * @param {boolean} [large=false] Makes the dropdown significantly larger
 * @param {number} [defaultValue=0] Starts the dropdown with a specific index in the list selected
 *
 */
export class PromptDropdown extends InPromptUIObject {

  public labelElement: PromptDropdownLabelElementProps

  public label: string
  public options: readonly string[]
  public xPosition: number
  public yPosition: number
  public large: boolean
  public defaultValue: number
  public absolute: boolean
  public onChange: (index:number) => void

  private _xPosition: number | undefined
  private _yPosition: number | undefined

  constructor({
    parent,
    startHidden = promptDropdownInitialConfig.startHidden,
    label = promptDropdownInitialConfig.label,
    options = promptDropdownInitialConfig.options,
    xPosition = promptDropdownInitialConfig.xPosition,
    yPosition = promptDropdownInitialConfig.yPosition,
    large = promptDropdownInitialConfig.large,
    defaultValue = promptDropdownInitialConfig.defaultValue,
    onChange = promptDropdownInitialConfig.onChange,
    positionAbsolute = promptDropdownInitialConfig.positionAbsolute,
  }: PromptDropdownConfig) {
    super({
      startHidden,
      parent,
    })


    this.label = label
    this.options = options
    this.xPosition = xPosition * scaleFactor
    this.yPosition = yPosition * scaleFactor
    this.large = large
    this.defaultValue = defaultValue
    this.onChange = onChange


    this.absolute = positionAbsolute

    this.labelElement = {
      uiTransform: {
        maxWidth: '100%',
        height: '100%',
      },
      textAlign: 'middle-left',
      font: defaultFont,
      fontSize: 20  * scaleFactor,
    }
  }



  /**
   * Reacts when the selected value changes.
   */
  // public onChange(): void {

  // }

  public render(key?: string): ReactEcs.JSX.Element {
    this._xPosition = this.promptWidth / -2 + this.promptWidth / 2 + this.xPosition
    this._yPosition = this.promptHeight / 2 + 32 / -2 + this.yPosition

    return (
      <UiEntity
      key={key}
      uiTransform={{
        display: this.visible ? 'flex' : 'none',
        width: '100%',
        height:  32 * scaleFactor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        positionType: this.absolute ? 'absolute' : 'relative',
          margin: { right: 10  * scaleFactor, left: 10  * scaleFactor, top: 20  * scaleFactor, bottom: 20  * scaleFactor },
          position: { bottom: this.yPosition, right: this.xPosition * -1 }
      }}
    >
      <Label
        {...this.labelElement}
        value={String(this.label)}
        color={this.labelElement.color || (this.isDarkTheme ? Color4.White() : Color4.Black())}
        uiTransform={{
          margin: { right: 5  * scaleFactor },
        }}
        
      />
      <Dropdown
        options={this.options.concat()}
        onChange={this.onChange}
        
        uiTransform={{
          width: 'auto',
          minWidth: this.large ? 200 * scaleFactor : 100 * scaleFactor,
          height: this.large ? 42 * scaleFactor : 32 * scaleFactor,
          padding: { left: 2 * scaleFactor, right: 2 * scaleFactor },
        }}
        fontSize={ this.large ? 24 * scaleFactor : 20 * scaleFactor}
        font={defaultFont}
        color={this.isDarkTheme ? Color4.White() : Color4.Black()}
        
      />
    </UiEntity>




      // <UiEntity
      //   key={key}
      //   uiTransform={{
      //     display: this.visible ? 'flex' : 'none',
      //     width: '100%',
      //     height: 32 * scaleFactor,
      //     flexDirection: 'row',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     positionType: this.absolute ? 'absolute' : 'relative',
      //     margin: { right: 10  * scaleFactor, left: 10  * scaleFactor, top: 20  * scaleFactor, bottom: 20  * scaleFactor },
      //     position: { bottom: this.yPosition, right: this.xPosition * -1 },    
      //   }}
      // >
      //   <UiEntity
      //     {...this.imageElement}
      //     uiBackground={{
      //       ...this.imageElement.uiBackground,
      //       uvs: getImageAtlasMapping({
      //         ...sourcesComponentsCoordinates.checkboxes[this._getImageStyle()],
      //         atlasHeight: sourcesComponentsCoordinates.atlasHeight,
      //         atlasWidth: sourcesComponentsCoordinates.atlasWidth,
      //       }),
      //     }}
      //     uiTransform={{
      //       ...this.imageElement.uiTransform,
      //       width: this.large ? 32 * scaleFactor : 24 * scaleFactor,
      //       height: this.large ? 32 * scaleFactor : 24 * scaleFactor,
      //     }}
      //     onMouseDown={this._click}
      //   />
      //   <Label
      //     {...this.labelElement}
      //     value={String(this.text)}
      //     color={this.labelElement.color || (this.isDarkTheme ? Color4.White() : Color4.Black())}
      //   />
      // </UiEntity>
    )
  }

  // private _getImageStyle():
  //   | 'wLargeOff'
  //   | 'wLargeOn'
  //   | 'wOff'
  //   | 'wOn'
  //   | 'dLargeOff'
  //   | 'dLargeOn'
  //   | 'dOff'
  //   | 'dOn' {
  //   if (this.isDarkTheme) {
  //     if (this.large) {
  //       return !this._checked ? 'wLargeOff' : 'wLargeOn'
  //     } else {
  //       return !this._checked ? 'wOff' : 'wOn'
  //     }
  //   } else {
  //     if (this.large) {
  //       return !this._checked ? 'dLargeOff' : 'dLargeOn'
  //     } else {
  //       return !this._checked ? 'dOff' : 'dOn'
  //     }
  //   }
  }

  // private _click = (): void => {
  //   if (!this._checked) {
  //     this.check()
  //     this.onCheck()
  //   } else {
  //     this.uncheck()
  //     this.onUncheck()
  //   }

  //   this.imageElement.onMouseDown?.()
  // }
// }
