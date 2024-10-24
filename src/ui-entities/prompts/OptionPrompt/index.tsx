import ReactEcs from '@dcl/sdk/react-ecs'
// import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

import { Prompt, PromptExternalConfig, PromptStyles } from '../Prompt'
import { PromptButton, PromptButtonStyles } from '../Prompt/components/Button'
import { PromptText } from '../Prompt/components/Text'
import { scaleFactor } from '../../../utils/scaleFactor'

type OptionPromptConfig = PromptExternalConfig & {
  title: string | number;
  titleSize?: number;
  text: string | number;
  textSize?: number;
  useDarkTheme?: boolean;
  acceptLabel?: string;
  acceptSize?: number | 'auto'
  rejectLabel?: string;
  rejectSize?: number | 'auto'
  onAccept: () => void;
  onReject?: () => void;
}

type OptionPromptSizeConfig = {
  width?: 'auto' | number;
  height?: 'auto'| number;
}

const optionPromptInitialConfig: Required<OptionPromptConfig & OptionPromptSizeConfig> = {
  startHidden: true,
  title: '',
  titleSize: 24,
  text: '',
  textSize: 21,
  useDarkTheme: false,
  acceptLabel: 'Yes',
  acceptSize: 'auto',
  rejectLabel: 'No',
  rejectSize: 'auto',
  width: 'auto',
  height: 'auto',
  onAccept: () => {
  },
  onReject: () => {
  },
  onClose: () => {
  },
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
      titleSize = optionPromptInitialConfig.titleSize  * scaleFactor,
      text = optionPromptInitialConfig.text,
      textSize = optionPromptInitialConfig.textSize  * scaleFactor,
      useDarkTheme = optionPromptInitialConfig.useDarkTheme,
      acceptLabel = optionPromptInitialConfig.acceptLabel,
      acceptSize = optionPromptInitialConfig.acceptSize ,
      rejectLabel = optionPromptInitialConfig.rejectLabel,
      rejectSize = optionPromptInitialConfig.rejectSize,
      onAccept = optionPromptInitialConfig.onAccept,
      onReject = optionPromptInitialConfig.onReject,
      onClose = optionPromptInitialConfig.onClose,
      width = optionPromptInitialConfig.width,
      height = optionPromptInitialConfig.height,
    }: OptionPromptConfig) {
    super(
      {
        startHidden,
        style: useDarkTheme ? PromptStyles.DARK : PromptStyles.LIGHT,
        width: width,
        height: height,
        onClose,
      })

    this.titleElement = this.addText({
      value: String(title),
      positionAbsolute: false,
      size: titleSize,
    })

    this.textElement = this.addText({
      value: String(text),
      positionAbsolute: false,
      size: textSize,
    })

    this.primaryButtonElement = this.addButton({
      text: String(acceptLabel),
      onMouseDown: onAccept,
      xPosition: 0,
      yPosition: 0,
      positionAbsolute: false,
      style: PromptButtonStyles.E,
      buttonSize: acceptSize
    })

    this.secondaryButtonElement = this.addButton({
      text: String(rejectLabel),
      onMouseDown: onReject,
      xPosition: 0,
      yPosition: 0,
      positionAbsolute: false,
      style: PromptButtonStyles.F,
      buttonSize: rejectSize
    })
  }
}
