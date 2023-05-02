import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { getImageAtlasMapping } from '../../../../../utils/imageUtils'

import { AtlasTheme, sourcesComponentsCoordinates } from '../../../../../constants/resources'

export type PromptCloseIconIconElementProps = Omit<
  EntityPropTypes,
  'uiTransform' | 'uiBackground'
> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'width' | 'height' | 'position' | 'display'
  >
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'>
}

export enum PromptCloseIconStyles {
  CLOSEW = `closeW`,
  CLOSED = `closeD`,
}

export type PromptCloseIconConfig = InPromptUIObjectConfig & {
  style: PromptCloseIconStyles
  width?: number
  height?: number
  xPosition?: number
  yPosition?: number
  onMouseDown: Callback
}

const promptCloseIconInitialConfig: Omit<Required<PromptCloseIconConfig>, 'parent'> = {
  startHidden: false,
  style: PromptCloseIconStyles.CLOSED,
  width: 32,
  height: 32,
  xPosition: 10,
  yPosition: 10,
  onMouseDown: () => {},
} as const

/**
 * Prompt close button
 * @param {boolean} [startHidden=false] starting hidden
 * @param {PromptCloseIconStyles} [style=CloseIconStyles.CLOSED] visible variant
 * @param {number} [width=32] image width
 * @param {number} [height=32] image height
 * @param {number} [xPosition=0] position on X
 * @param {number} [yPosition=0] position on Y
 * @param {Callback} [onMouseDown=0] click action
 *
 */
export class PromptCloseIcon extends InPromptUIObject {
  public iconElement: PromptCloseIconIconElementProps

  public style: PromptCloseIconStyles
  public width: number
  public height: number
  public xPosition: number
  public yPosition: number
  public onMouseDown: Callback

  constructor({
    parent,
    startHidden = promptCloseIconInitialConfig.startHidden,
    style = promptCloseIconInitialConfig.style,
    width = sourcesComponentsCoordinates.icons[style].sourceWidth,
    height = sourcesComponentsCoordinates.icons[style].sourceHeight,
    xPosition = promptCloseIconInitialConfig.xPosition,
    yPosition = promptCloseIconInitialConfig.yPosition,
    onMouseDown = promptCloseIconInitialConfig.onMouseDown,
  }: PromptCloseIconConfig) {
    super({
      startHidden,
      parent,
    })

    this.onMouseDown = onMouseDown

    this.width = width
    this.height = height
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.style = style

    this.iconElement = {
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: AtlasTheme.ATLAS_PATH_LIGHT,
        },
      },
      uiTransform: {
        positionType: 'absolute',
      },
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <UiEntity
        key={key}
        {...this.iconElement}
        uiBackground={{
          ...this.iconElement.uiBackground,
          uvs: getImageAtlasMapping({
            ...sourcesComponentsCoordinates.icons[this.style],
            atlasHeight: sourcesComponentsCoordinates.atlasHeight,
            atlasWidth: sourcesComponentsCoordinates.atlasWidth,
          }),
        }}
        uiTransform={{
          ...this.iconElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          width: this.width,
          height: this.height,
          position: { top: this.yPosition, right: this.xPosition },
        }}
        onMouseDown={this.onMouseDown}
      />
    )
  }
}
