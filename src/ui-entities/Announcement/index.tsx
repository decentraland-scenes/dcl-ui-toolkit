import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'

import { DelayedHidingUIObject, DelayedHidingUIObjectConfig } from '../UIObject'

import { defaultFont } from '../../constants/font'

export type AnnouncementTextElement = Omit<UiLabelProps, 'value' | 'fontSize' | 'color'> &
  Omit<EntityPropTypes, 'uiTransform'> & {
    uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'margin' | 'display'>
  }

export type AnnouncementConfig = DelayedHidingUIObjectConfig & {
  value: string | number
  duration?: number
  xOffset?: number
  yOffset?: number
  color?: Color4
  size?: number
}

const announcementInitialConfig: Required<AnnouncementConfig> = {
  startHidden: true,
  value: '',
  duration: 3,
  xOffset: 0,
  yOffset: 0,
  color: Color4.Yellow(),
  size: 50,
} as const

/**
 * Displays a text on center of the UI.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [duration=3] duration time to keep the text visible (in seconds) if starting visible
 * @param {number} [xOffset=0] offset on X
 * @param {number} [yOffset=0] offset on Y
 * @param {Color4} [color=Color4.Yellow()] text color
 * @param {number} [size=50] text size
 *
 */
export class Announcement extends DelayedHidingUIObject {
  public textElement: AnnouncementTextElement

  public xOffset: number
  public yOffset: number
  public color: Color4
  public size: number
  public value: string | number

  constructor({
    startHidden = announcementInitialConfig.startHidden,
    value = announcementInitialConfig.value,
    duration = announcementInitialConfig.duration,
    xOffset = announcementInitialConfig.xOffset,
    yOffset = announcementInitialConfig.yOffset,
    color = announcementInitialConfig.color,
    size = announcementInitialConfig.size,
  }: AnnouncementConfig) {
    super({ startHidden, duration })

    this.xOffset = xOffset
    this.yOffset = yOffset
    this.color = color
    this.size = size

    this.value = value

    this.textElement = {
      textAlign: 'bottom-center',
      font: defaultFont,
    }
  }

  public render(key?: string): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '100%',
          height: '100%',
          display: this.visible ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Label
          key={key}
          {...this.textElement}
          fontSize={this.size}
          color={this.color}
          value={String(this.value)}
          uiTransform={{
            ...this.textElement.uiTransform,
            display: this.visible ? 'flex' : 'none',
            position: {
              left: this.xOffset,
              bottom: this.yOffset,
            },
          }}
        />
      </UiEntity>
    )
  }
}
