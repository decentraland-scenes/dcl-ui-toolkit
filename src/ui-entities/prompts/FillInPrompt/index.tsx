import ReactEcs from '@dcl/sdk/react-ecs'
import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

import { Prompt, PromptExternalConfig, PromptStyles } from '../Prompt'
import { PromptButton, PromptButtonStyles } from '../Prompt/components/Button'
import { PromptText } from '../Prompt/components/Text'
import { PromptInput } from '../Prompt/components/Input'

type FillInPromptConfig = PromptExternalConfig & {
  title: string | number;
  titleSize?: number;
  useDarkTheme?: boolean;
  placeholder?: string | number;
  acceptLabel?: string;
  acceptSize?: number | 'auto';
  onAccept: (value: string) => void;
}

const fillInPromptInitialConfig: Required<FillInPromptConfig> = {
  startHidden: true,
  title: '',
  titleSize: 24,
  useDarkTheme: false,
  placeholder: 'Fill in',
  acceptLabel: 'Submit',
  acceptSize: 'auto',
  width: 'auto',
  height: 'auto',
  onAccept: () => {
  },
  onClose: () => {
  },
} as const

/**
 * Displays a prompt window with a field that can be filled in
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} width background width
 * @param {number} height background height
 * @param {string | number} [title=''] header on dialog
 * @param {number} [titleSize=24] header text size
 * @param {boolean} [useDarkTheme=false] switch to the dark theme
 * @param {string | number} [placeholder='Fill in'] text to display as placeholder in the fill in box
 * @param {string} [acceptLabel='Submit'] string to go in the accept button
 * @param {number} width background width
 * @param {number} height background height
 * @param {(value: string) => void} onAccept function that gets executed if player clicks button
 * @param {Callback} onClose callback on prompt close
 *
 */
export class FillInPrompt extends Prompt {
  public titleElement: PromptText
  public inputElement: PromptInput
  public buttonElement: PromptButton

  private _inputText: string

  constructor(
    {
      startHidden = fillInPromptInitialConfig.startHidden,
      title = fillInPromptInitialConfig.title,
      titleSize = fillInPromptInitialConfig.titleSize,
      useDarkTheme = fillInPromptInitialConfig.useDarkTheme,
      placeholder = fillInPromptInitialConfig.placeholder,
      acceptLabel = fillInPromptInitialConfig.acceptLabel,
      acceptSize = fillInPromptInitialConfig.acceptSize,
      onAccept = fillInPromptInitialConfig.onAccept,
      onClose = fillInPromptInitialConfig.onClose,
      width = fillInPromptInitialConfig.width,
      height = fillInPromptInitialConfig.height,
    }: FillInPromptConfig) {
    super(
      {
        startHidden,
        style: useDarkTheme ? PromptStyles.DARK : PromptStyles.LIGHT,
        width: width,
        height: height,
        onClose,
      })

    this._inputText = ''

    this.titleElement = this.addText({
      value: String(title),
      size: titleSize,
    })

    this.inputElement = this.addTextBox({
      placeholder: String(placeholder),
      onChange: (value) => {
        this._inputText = value
      },
      xPosition: 0,
      yPosition: 0,
    })

    this.buttonElement = this.addButton({
      text: String(acceptLabel),
      onMouseDown: () => {
        onAccept(this._inputText)
      },
      xPosition: 0,
      yPosition: 0,
      style: PromptButtonStyles.E,
      buttonSize: acceptSize,
    })
  }
}
