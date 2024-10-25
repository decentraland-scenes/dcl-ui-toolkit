import ReactEcs from '@dcl/sdk/react-ecs'
// import { Callback } from '@dcl/react-ecs/dist/components/listeners/types'

import { Prompt, PromptExternalConfig, PromptStyles } from '../Prompt'
import { PromptButton, PromptButtonStyles } from '../Prompt/components/Button'
import { PromptText } from '../Prompt/components/Text'
import { scaleFactor } from '../../../utils/scaleFactor'

type OkPromptConfig = PromptExternalConfig & {
  text: string | number;
  textSize?: number;
  useDarkTheme?: boolean;
  acceptLabel?: string;
  acceptSize?: number | 'auto'
  onAccept?: () => void;
  filter?: (text: string | number) => number;
}

const okPromptInitialConfig: Required<OkPromptConfig> = {
  startHidden: true,
  text: '',
  textSize: 24,
  useDarkTheme: false,
  acceptLabel: 'Ok',
  acceptSize: 'auto',
  width: 'auto',
  height: 'auto',
  onAccept: () => {
  },
  onClose: () => {
  },
  filter: (text: string | number) => {
    return (String(text).match(/((?:\S+\s*){5})/g)||'').length
  }
} as const

/**
 * Displays a prompt window with a custom string and an OK button
 * @param {boolean} [startHidden=true] starting hidden
 * @param {number} width background width
 * @param {number} height background height
 * @param {string | number} [text=''] notification string
 * @param {number} [textSize=24] notification string size
 * @param {boolean} [useDarkTheme=false] switch to the dark theme
 * @param {string} [acceptLabel='Ok'] string to go in the accept button
 * @param {() => void} onAccept function that gets executed if player clicks button
 * @param {Callback} onClose callback on prompt close
 *
 */
export class OkPrompt extends Prompt {
  public textElement: PromptText
  public buttonElement: PromptButton

  constructor(
    {
      startHidden = okPromptInitialConfig.startHidden,
      text = okPromptInitialConfig.text,
      textSize = okPromptInitialConfig.textSize,
      useDarkTheme = okPromptInitialConfig.useDarkTheme,
      acceptLabel = okPromptInitialConfig.acceptLabel,
      onAccept = okPromptInitialConfig.onAccept,
      acceptSize = okPromptInitialConfig.acceptSize ,
      onClose = okPromptInitialConfig.onClose,
      filter = okPromptInitialConfig.filter,
      width = okPromptInitialConfig.width,
      height = okPromptInitialConfig.height,
    }: OkPromptConfig) {
    super(
      {
        startHidden,
        style: useDarkTheme ? PromptStyles.DARK : PromptStyles.LIGHT,
        width: width,
        height: height,
        onClose,
      })

    this.textElement = this.addText({
      value: String(text),
      positionAbsolute: false,
      size: textSize,
    })

    this.buttonElement = this.addButton({
      text: String(acceptLabel),
      onMouseDown: onAccept,
      xPosition: 0,
      yPosition: 0,
      positionAbsolute: false,
      style: PromptButtonStyles.E,
      buttonSize: acceptSize
    })
  }
}