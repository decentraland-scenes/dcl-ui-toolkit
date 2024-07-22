import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'

import { InPromptUIObject, InPromptUIObjectConfig } from '../../InPromptUIObject'

import { getImageAtlasMapping, ImageAtlasData } from '../../../../../utils/imageUtils'

export type PromptIconImageElementProps = Omit<EntityPropTypes, 'uiTransform' | 'uiBackground'> & {
  uiTransform?: Omit<
    NonNullable<EntityPropTypes['uiTransform']>,
    'width' | 'height' | 'position' | 'display'
  >
  uiBackground?: Omit<NonNullable<EntityPropTypes['uiBackground']>, 'uvs'> & {
    texture?: Omit<NonNullable<NonNullable<EntityPropTypes['uiBackground']>['texture']>, 'src'>
  }
}

export type PromptIconConfig = InPromptUIObjectConfig & {
  image: string
  width?: number
  height?: number
  xPosition?: number
  yPosition?: number
  section?: ImageAtlasData
  positionAbsolute?: boolean,
}

const promptIconInitialConfig: Omit<Required<PromptIconConfig>, 'section' | 'parent'> = {
  startHidden: false,
  image: '',
  width: 128,
  height: 128,
  xPosition: 0,
  yPosition: 0,
  positionAbsolute: false,
} as const

/**
 * Prompt icon
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=128] image width
 * @param {number} [height=128] image height
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class PromptIcon extends InPromptUIObject {
  public imageElement: PromptIconImageElementProps

  public image: string
  public width: number
  public height: number
  public xPosition: number
  public yPosition: number
  public absolute: boolean
  public section: ImageAtlasData | undefined

  private _xPosition: number | undefined
  private _yPosition: number | undefined

  constructor({
    section,
    parent,
    startHidden = promptIconInitialConfig.startHidden,
    image = promptIconInitialConfig.image,
    width = promptIconInitialConfig.width,
    height = promptIconInitialConfig.height,
    xPosition = promptIconInitialConfig.xPosition,
    yPosition = promptIconInitialConfig.yPosition,
    positionAbsolute = promptIconInitialConfig.positionAbsolute,
  }: PromptIconConfig) {
    super({
      startHidden,
      parent,
    })

    this.width = width
    this.height = height
    this.xPosition = xPosition
    this.yPosition = yPosition
    this.image = image
    this.absolute = positionAbsolute
    if (section) this.section = section

    this.imageElement = {
      uiTransform: {
        positionType: this.absolute,
      },
      uiBackground: {
        textureMode: 'stretch',
      },
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    this._xPosition = this.promptWidth / -2 + this.width / 2 + this.xPosition
    this._yPosition = this.promptHeight / 2 + this.height / -2 + this.yPosition

    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiBackground={{
          ...this.imageElement.uiBackground,
          texture: {
            ...this.imageElement.uiBackground?.texture,
            src: this.image,
          },
          uvs: getImageAtlasMapping(this.section),
        }}
        uiTransform={{
          ...this.imageElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          positionType: this.absolute ? 'absolute' : 'relative',
          position: this.absolute? { bottom: this._yPosition, right: this._xPosition * -1 } : {},
          alignSelf: 'center',
          width: this.width,
          height: this.height,
        }}
      />
    )
  }
}
