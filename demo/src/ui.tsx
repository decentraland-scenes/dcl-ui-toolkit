import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'

import { announcement } from './ui-entities/Announcement'
import { uiCounter } from './ui-entities/UiCounter'
import { cornerLabel } from './ui-entities/CornerLabel'
import { uiBar } from './ui-entities/UiBar'
import { largeIcon, mediumIcon, smallIcon } from './ui-entities/Icons'
import { loadingIcon } from './ui-entities/LoadingIcon'
import { centerImage } from './ui-entities/CenterImage'
import { okPrompt } from './ui-entities/OkPrompt'
import { optionPrompt } from './ui-entities/OptionPrompt'
import { fillInPrompt } from './ui-entities/FillInPrompt'
import { customPrompt } from './ui-entities/CustomPrompt'


const uiComponent = () => {
  return [
    announcement.render('announcement'),
    uiCounter.render('uiCounter'),
    cornerLabel.render('cornerLabel'),
    uiBar.render('uiBar'),
    smallIcon.render('smallIcon'),
    mediumIcon.render('mediumIcon'),
    largeIcon.render('largeIcon'),
    loadingIcon.render('loadingIcon'),
    centerImage.render('centerImage'),
    okPrompt.render('okPrompt'),
    optionPrompt.render('optionPrompt'),
    fillInPrompt.render('fillInPrompt'),
    customPrompt.render('customPrompt'),
  ]
}

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}