import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

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

export enum PromptStyles {
  LIGHT = `light`,
  DARK = `dark`,
  LIGHTLARGE = `lightlarge`,
  DARKLARGE = `darklarge`,
  LIGHTSLANTED = `lightslanted`,
  DARKSLANTED = `darkslanted`,
}

export type PromptExternalConfig = UIObjectConfig & {
  width?: number
  height?: number
  onClose?: Callback
}

export type PromptConfig = PromptExternalConfig & {
  style?: PromptStyles
}

const promptInitialConfig: Required<PromptConfig> = {
  startHidden: true,
  style: PromptStyles.LIGHT,
  width: 400,
  height: 250,
  onClose: () => {},
} as const

/**
 * Creates a prompt object that includes a background and a close icon, and supports adding as many custom UI elements as desired
 * @param {boolean} [startHidden=true] starting hidden
 * @param {PromptStyles} [style=PromptStyles.LIGHT]: pick from a few predefined options of color, shape and size, or provide the string path to a custom image
 * @param {number} width background width
 * @param {number} height background height
 * @param {Callback} onClose callback on prompt close
 *
 */
export class Prompt extends UIObject implements IPrompt {
  public closeIcon: PromptCloseIcon

  public style: PromptStyles
  public width: number | undefined
  public height: number | undefined
  public onClose: Callback

  private _texture: AtlasTheme
  private _section: ImageAtlasData
  private _components: (
    | PromptCloseIcon
    | PromptText
    | PromptIcon
    | PromptButton
    | PromptCheckbox
    | PromptSwitch
    | PromptInput
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
      width: 32,
      height: 32,
      style: PromptCloseIconStyles.CLOSED,
      onMouseDown: this._close,
      parent: this,
    }

    this._setStyle()

    this.isDarkTheme = this._texture !== AtlasTheme.ATLAS_PATH_LIGHT

    this.closeIcon = new PromptCloseIcon(this._closeIconData)

    this._components = [this.closeIcon]
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

    this._components.push(uiButton)

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
        key={key}
        uiTransform={{
          display: this.visible ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '50%', left: '50%' },
          margin: { top: -height / 2, left: -width / 2 },
          width,
          height,
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
          this._components.map((component, idx) => component.render(`prompt-component-${idx}`))}
      </UiEntity>
    )
  }

  private _getPromptComponentCustomConfig() {
    return {
      parent: this,
    }
  }

  public realWidth(): number {
    return this.width ? this.width : this._section.sourceWidth
  }

  public realHeight(): number {
    return this.height ? this.height : this._section.sourceHeight
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
        this._closeIconData.xPosition = 15

        break

      case PromptStyles.DARKSLANTED:
        this._section = {
          ...sourcesComponentsCoordinates.backgrounds.promptSlantedBackground,
          atlasHeight: sourcesComponentsCoordinates.atlasHeight,
          atlasWidth: sourcesComponentsCoordinates.atlasWidth,
        }

        this._texture = AtlasTheme.ATLAS_PATH_DARK

        this._closeIconData.style = PromptCloseIconStyles.CLOSEW
        this._closeIconData.xPosition = 15

        break
    }
  }

  private _close = (): void => {
    this.onClose()

    this.hide()
  }
}
