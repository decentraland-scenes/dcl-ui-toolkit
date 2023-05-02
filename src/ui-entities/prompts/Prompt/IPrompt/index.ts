export interface IPrompt {
  realWidth(): number
  realHeight(): number
  isVisible(): boolean

  get isDarkTheme(): boolean
}
