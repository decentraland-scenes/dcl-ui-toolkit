import ReactEcs from '@dcl/sdk/react-ecs'

import { UIObject, UIObjectConfig } from '../../../UIObject'
import { IPrompt } from '../IPrompt'

export type InPromptUIObjectConfig = UIObjectConfig & {
  parent: IPrompt
}

export abstract class InPromptUIObject extends UIObject {
  protected parent: IPrompt

  protected constructor({ parent, ...config }: InPromptUIObjectConfig) {
    super(config)

    this.parent = parent
  }

  protected get promptWidth() {
    return this.parent.realWidth()
  }

  protected get promptHeight() {
    return this.parent.realHeight()
  }

  protected get isDarkTheme() {
    return this.parent.isDarkTheme
  }

  protected get isPromptVisible() {
    return this.parent.isVisible()
  }
}
