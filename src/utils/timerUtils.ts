import { engine } from '@dcl/sdk/ecs'

export type TimerConfig = {
  seconds: number;
  callback: () => void;
}

export class Timer {
  private _endTime: number
  private readonly _seconds: number
  private readonly _callback: () => void

  constructor({ seconds, callback }: TimerConfig) {
    this._seconds = seconds
    this._endTime = this._seconds
    this._callback = callback
  }

  public start(): void {
    if (this._endTime !== this._seconds) return

    console.log('start timer_________________')
    engine.addSystem(this._timeOutSystemHandle)
  }

  public stop(): void {
    if (this._endTime === this._seconds) return

    console.log('stop timer_________________')
    engine.removeSystem(this._timeOutSystemHandle)

    this._endTime = this._seconds
  }

  private _timeOutSystemHandle = (dt: number): void => {
    this._endTime -= dt

    if (this._endTime <= 0) {

      this._callback()

      this.stop()
    }
  }
}