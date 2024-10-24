import { scaleFactor, UIScaleUpdate } from './utils/scaleFactor'

export { UIObject } from './ui-entities/UIObject'
export { Announcement } from './ui-entities/Announcement'
export { Counter as UICounter } from './ui-entities/Counter'
export { CornerLabel } from './ui-entities/CornerLabel'
export { BarStyles, ProgressBar as UIBar } from './ui-entities/ProgressBar'
export { LargeIcon, MediumIcon, SmallIcon } from './ui-entities/Icon'
export { Loading as LoadingIcon } from './ui-entities/Loading'
export { CenterImage } from './ui-entities/CenterImage'
export { Prompt as CustomPrompt, PromptStyles } from './ui-entities/prompts/Prompt'
export { PromptButtonStyles as ButtonStyles } from './ui-entities/prompts/Prompt/components/Button'
export { PromptSwitchStyles as SwitchStyles } from './ui-entities/prompts/Prompt/components/Switch'
export { OkPrompt } from './ui-entities/prompts/OkPrompt'
export { OptionPrompt } from './ui-entities/prompts/OptionPrompt'
export { FillInPrompt } from './ui-entities/prompts/FillInPrompt'

export { render, createComponent, destroyComponent } from './utils/factory'

export { scaleFactor } from './utils/scaleFactor'

// function main() {
//   UIScaleUpdate()
// }