import ReactEcs from '@dcl/sdk/react-ecs'
import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

import { Prompt, PromptExternalConfig, PromptStyles } from '../Prompt'
import { PromptButton, PromptButtonStyles } from '../Prompt/components/Button'
import { PromptText } from '../Prompt/components/Text'

type OptionPromptConfig = PromptExternalConfig & {
  title: string | number;
  titleSize?: number;
  text: string | number;
  textSize?: number;
  useDarkTheme?: boolean;
  acceptLabel?: string;
  rejectLabel?: string;
  onAccept: () => void;
  onReject?: () => void;
  filter?: (text: string | number) => number
}

type OptionPromptSizeConfig = {
  width?: number;
  height?: number;
}

const optionPromptInitialConfig: Required<OptionPromptConfig & OptionPromptSizeConfig> = {
  startHidden: true,
  title: '',
  titleSize: 24,
  text: '',
  textSize: 21,
  useDarkTheme: false,
  acceptLabel: 'Yes',
  rejectLabel: 'No',
  width: 480,
  height: 384,
  onAccept: () => {
  },
  onReject: () => {
  },
  onClose: () => {
  },
  filter: (text: string | number) => {
    return (String(text).match(/((?:\S+\s*){5})/g)||'').length
  }
} as const

/**
 * Displays a loading icon in the center of the screen
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} width background width
 * @param {number} height background height
 * @param {string | number} [title=''] header on dialog
 * @param {number} [titleSize=24] header text size
 * @param {string | number} [text=''] smaller print instructions
 * @param {number} [textSize=21] smaller print instructions size
 * @param {boolean} [useDarkTheme=false] switch to the dark theme
 * @param {string} [acceptLabel='Yes'] string to go in the accept button
 * @param {string} [rejectLabel='No'] string to go in the reject button
 * @param {() => void} onAccept function that gets executed if player clicks button
 * @param {() => void} onReject function that gets executed if player clicks reject
 * @param {Callback} onClose callback on prompt close
 *
 */
export class OptionPrompt extends Prompt {
  public titleElement: PromptText
  public textElement: PromptText
  public primaryButtonElement: PromptButton
  public secondaryButtonElement: PromptButton

  constructor(
    {
      startHidden = optionPromptInitialConfig.startHidden,
      title = optionPromptInitialConfig.title,
      titleSize = optionPromptInitialConfig.titleSize,
      text = optionPromptInitialConfig.text,
      textSize = optionPromptInitialConfig.textSize,
      useDarkTheme = optionPromptInitialConfig.useDarkTheme,
      acceptLabel = optionPromptInitialConfig.acceptLabel,
      rejectLabel = optionPromptInitialConfig.rejectLabel,
      onAccept = optionPromptInitialConfig.onAccept,
      onReject = optionPromptInitialConfig.onReject,
      onClose = optionPromptInitialConfig.onClose,
      filter = optionPromptInitialConfig.filter
    }: OptionPromptConfig) {
    super(
      {
        startHidden,
        style: useDarkTheme ? PromptStyles.DARK : PromptStyles.LIGHT,
        width: optionPromptInitialConfig.width,
        height: optionPromptInitialConfig.height + filter(text) * (filter(text) <= 10 ?  10 :  18),
        onClose,
      })

    this.titleElement = this.addText({
      value: String(title),
      xPosition: 0,
      yPosition: 160 + filter(text) * (filter(text) <= 10 ?  3 :  9),
      size: titleSize,
    })

    this.textElement = this.addText({
      value: String(text).split(/((?:\S+\s*){5})/g).filter(Boolean).join('\n'),
      xPosition: 0,
      yPosition: 40,
      size: textSize,
    })

    this.primaryButtonElement = this.addButton({
      text: String(acceptLabel),
      xPosition: -100,
      yPosition: -120 - filter(text)* (filter(text) <= 10 ?  3 :  8),
      onMouseDown: onAccept,
      style: PromptButtonStyles.E,
    })

    this.secondaryButtonElement = this.addButton({
      text: String(rejectLabel),
      xPosition: 100,
      yPosition: -120 - filter(text) * (filter(text) <= 10 ?  3 :  8),
      onMouseDown: onReject,
      style: PromptButtonStyles.F,
    })
  }
}
