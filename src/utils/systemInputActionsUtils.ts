import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

export type SystemInputActionsConfig = {
  inputAction: InputAction;
  callback: () => void;
}

export class SystemInputActions {
  private readonly _callback: () => void
  private _isActive: boolean
  private readonly _inputAction: InputAction

  constructor({ callback, inputAction }: SystemInputActionsConfig) {
    this._isActive = false
    this._inputAction = inputAction
    this._callback = callback
  }

  public add(): void {
    this.remove()

    console.log('add event listener_________________')
    engine.addSystem(this._systemInputHandle)
    this._isActive = true
  }

  public remove(): void {
    if (!this._isActive) return

    console.log('remove event listener_________________')
    engine.removeSystem(this._systemInputHandle)
    this._isActive = false
  }

  private _systemInputHandle = (): void => {
    if (inputSystem.isTriggered(this._inputAction, PointerEventType.PET_DOWN)) {
      this._callback()
    }
  }
}