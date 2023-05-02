import ReactEcs from '@dcl/sdk/react-ecs'

import { Timer } from '../../utils/timerUtils'

export interface UIObjectInterface {
  /**
   * Returns UiEntity.
   */
  render(key?: string): ReactEcs.JSX.Element

  /**
   * Makes an invisible visible.
   */
  show(): void

  /**
   * Makes an invisible visible with delayed hiding.
   */
  show(duration?: number): void

  /**
   * Makes visible an invisible.
   */
  hide(): void

  /**
   * Returns the visibility of the object
   */
  isVisible(): boolean
}

export type UIObjectConfig = {
  startHidden?: boolean
}

export abstract class UIObject implements UIObjectInterface {
  protected visible: boolean

  protected constructor({ startHidden = true }: UIObjectConfig) {
    this.visible = !startHidden
  }

  abstract render(key?: string): ReactEcs.JSX.Element

  public show(): void
  public show(duration?: number): void {
    this.visible = true
  }

  public hide(): void {
    this.visible = false
  }

  public isVisible(): boolean {
    return this.visible
  }
}

export type DelayedHidingUIObjectConfig = UIObjectConfig & {
  duration?: number
}

export abstract class DelayedHidingUIObject extends UIObject {
  private _timer: Timer | undefined

  protected constructor(config: DelayedHidingUIObjectConfig) {
    super(config)

    const { startHidden, duration } = config

    if (!startHidden && duration) {
      this._createAndStartTimer(duration)
    }
  }

  public show(duration?: number): void {
    super.show()

    this._createAndStartTimer(duration)
  }

  public hide(): void {
    super.hide()

    this._clearTimer()
  }

  private _createAndStartTimer(duration?: number): void {
    if (!duration || !this.visible) return

    this._clearTimer()

    this._timer = new Timer({
      seconds: duration,
      callback: (): void => {
        console.log('end timer callback_________________')
        this.hide()
      },
    })

    this._timer.start()
  }

  private _clearTimer(): void {
    if (!this._timer) return

    this._timer.stop()
  }
}
