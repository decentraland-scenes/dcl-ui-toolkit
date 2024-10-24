import ReactEcs, { Callback, UiEntity } from '@dcl/sdk/react-ecs'
// import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

import { UIObject, UIObjectConfig } from '../../UIObject'

import {
  PromptCloseIcon,
  PromptCloseIconConfig,
  PromptCloseIconStyles,
} from './components/CloseIcon'
import { PromptText, PromptTextConfig } from './components/Text'
import { PromptIcon, PromptIconConfig } from './components/Icon'
import { PromptButton, PromptButtonConfig } from './components/Button'
import { PromptCheckbox, PromptCheckboxConfig } from './components/Checkbox'
import { PromptSwitch, PromptSwitchConfig } from './components/Switch'
import { PromptInput, PromptInputConfig } from './components/Input'

import { getImageAtlasMapping, ImageAtlasData } from '../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../constants/resources'
import { IPrompt } from './IPrompt'
import { scaleFactor } from '../../../utils/scaleFactor'

export enum PromptStyles {
  LIGHT = `light`,
  DARK = `dark`,
  LIGHTLARGE = `lightlarge`,
  DARKLARGE = `darklarge`,
  LIGHTSLANTED = `lightslanted`,
  DARKSLANTED = `darkslanted`,
}

export type PromptExternalConfig = UIObjectConfig & {
  width?: number | 'auto'
  height?: number | 'auto'
  onClose?: Callback
}

export type PromptConfig = PromptExternalConfig & {
  style?: PromptStyles
}

const promptInitialConfig: Required<PromptConfig> = {
  startHidden: true,
  style: PromptStyles.LIGHT,
  width: 400  * scaleFactor,
  height: 250  * scaleFactor,
  onClose: () => { },
} as const

/**
 * Creates a prompt object that includes a background and a close icon, and supports adding as many custom UI elements as desired
 * @param {boolean} [startHidden=true] starting hidden
 * @param {PromptStyles} [style=PromptStyles.LIGHT]: pick from a few predefined options of color, shape and size, or provide the string path to a custom image
 * @param {number | auto} width background width
 * @param {number | auto} height background height
 * @param {Callback} onClose callback on prompt close
 *
 */
export class Prompt extends UIObject implements IPrompt {
  public closeIcon: PromptCloseIcon

  public style: PromptStyles
  public width: number | 'auto' | undefined
  public height: number | 'auto' | undefined
  public posWidth: number | undefined
  public posHeight: number | undefined
  public onClose: Callback

  private _texture: AtlasTheme
  private _section: ImageAtlasData
  private _components: (

    | PromptText
    | PromptIcon
    | PromptCheckbox
    | PromptSwitch
    | PromptInput
  )[]
  private _btn: (
    | PromptButton
  )[]
  private _closeIconBtn: (
    | PromptCloseIcon
  )[]
  private readonly _closeIconData: PromptCloseIconConfig
  public readonly isDarkTheme: boolean

  constructor({
    startHidden = promptInitialConfig.startHidden,
    style = promptInitialConfig.style,
    width,
    height,
    onClose = promptInitialConfig.onClose,
  }: PromptConfig) {
    super({ startHidden })

    this.style = style
    this.width = width
    this.height = height
    this.onClose = onClose

    this._texture = AtlasTheme.ATLAS_PATH_LIGHT

    this._section = {
      ...sourcesComponentsCoordinates.backgrounds.promptBackground,
      atlasHeight: sourcesComponentsCoordinates.atlasHeight,
      atlasWidth: sourcesComponentsCoordinates.atlasWidth,
    }

    this._closeIconData = {
      width: 32  * scaleFactor,
      height: 32  * scaleFactor,
      style: PromptCloseIconStyles.CLOSED,
      onMouseDown: this._close,
      parent: this,
    }

    this._setStyle()

    this.isDarkTheme = this._texture !== AtlasTheme.ATLAS_PATH_LIGHT

    this.closeIcon = new PromptCloseIcon(this._closeIconData)

    this._components = []

    this._btn = []

    this._closeIconBtn = [this.closeIcon]

  }

  public addTextBox(config: Omit<PromptInputConfig, 'parent'>): PromptInput {
    const uiInput = new PromptInput({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._components.push(uiInput)

    return uiInput
  }

  public addSwitch(config: Omit<PromptSwitchConfig, 'parent'>): PromptSwitch {
    const uiSwitch = new PromptSwitch({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._components.push(uiSwitch)

    return uiSwitch
  }

  public addCheckbox(config: Omit<PromptCheckboxConfig, 'parent'>): PromptCheckbox {
    const uiCheckbox = new PromptCheckbox({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._components.push(uiCheckbox)

    return uiCheckbox
  }

  public addButton(config: Omit<PromptButtonConfig, 'parent'>): PromptButton {
    const uiButton = new PromptButton({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._btn.push(uiButton)

    return uiButton
  }

  public addText(config: Omit<PromptTextConfig, 'parent'>): PromptText {
    const uiText = new PromptText({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._components.push(uiText)

    return uiText
  }

  public addIcon(config: Omit<PromptIconConfig, 'parent'>): PromptIcon {
    const uiIcon = new PromptIcon({
      ...config,
      ...this._getPromptComponentCustomConfig(),
    })

    this._components.push(uiIcon)

    return uiIcon
  }

  public render(key?: string): ReactEcs.JSX.Element {
    const width = this.realWidth()
    const height = this.realHeight()

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute'
        }}
      >
        <UiEntity
          key={key}
          uiTransform={{
            display: this.visible ? 'flex' : 'none',
            flexDirection: 'column',
            positionType: 'absolute',
            justifyContent: 'center',
            width: this.width != 'auto' ? this.width : 'auto',
            height: this.height != 'auto' ? this.height : 'auto',
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: 0, left: 0 },
              width: '100%',
              height: '100%',
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: this._texture,
              },
              uvs: getImageAtlasMapping(this._section),
            }}
          />
          {this.visible &&
            this._closeIconBtn.map((component, idx) => component.render(`prompt-component-${idx}`))}
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              width: this.width != 'auto' ? width : 'auto',
              height: this.height != 'auto' ? height : 'auto',
              margin: {top: 20 * scaleFactor}
            }}
          >
            {this.visible &&
              this._components.map((component, idx) => component.render(`prompt-component-${idx}`))}
            <UiEntity
              uiTransform={{
                justifyContent: 'center',
                margin: {left: 20 * scaleFactor, right: 10 * scaleFactor}
              }}>
              {this.visible &&
                this._btn.map((component, idx) => component.render(`prompt-component-${idx}`))}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  private _getPromptComponentCustomConfig() {
    return {
      parent: this,
    }
  }

  public realWidth(): number {
    return this.posWidth ? this.posWidth : this._section.sourceWidth
  }

  public realHeight(): number {
    return this.posHeight ? this.posHeight : this._section.sourceHeight
  }

  private _setStyle() {
    switch (this.style) {
      case PromptStyles.LIGHT:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_LIGHT

        // this._closeIconData.style = PromptCloseIconStyles.CLOSED

        break
      case PromptStyles.DARK:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_DARK

        this._closeIconData.style = PromptCloseIconStyles.CLOSEW

        break
      case PromptStyles.LIGHTLARGE:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptLargeBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_LIGHT

        this._closeIconData.style = PromptCloseIconStyles.CLOSED

        break
      case PromptStyles.DARKLARGE:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptLargeBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_DARK

        this._closeIconData.style = PromptCloseIconStyles.CLOSEW

        break
      case PromptStyles.LIGHTSLANTED:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptSlantedBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_LIGHT

        this._closeIconData.style = PromptCloseIconStyles.CLOSED
        this._closeIconData.xPosition = 15  * scaleFactor

        break

      case PromptStyles.DARKSLANTED:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptSlantedBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_DARK

        this._closeIconData.style = PromptCloseIconStyles.CLOSEW
        this._closeIconData.xPosition = 15  * scaleFactor

        break
    }
  }

  private _close = (): void => {
    this.onClose()

    this.hide()
  }
}
