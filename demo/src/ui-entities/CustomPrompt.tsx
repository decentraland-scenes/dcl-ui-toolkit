import { Color4 } from '@dcl/sdk/math'

import * as ui from '@dcl-sdk/ui-utils'

export const customPrompt = new ui.CustomPrompt(
  {
    style: ui.PromptStyles.DARKLARGE,
    height: 550,
    width: 500,
    onClose: () => console.log('close customPrompt____________'),
  },
)

const promptTitle = customPrompt.addText({
  value: 'What will you do?',
  xPosition: 0,
  yPosition: 250,
  color: Color4.Yellow(),
  size: 30,
})

const promptIcon = customPrompt.addIcon({
  image: 'images/scene-thumbnail.png',
  xPosition: 0,
  yPosition: 128,
})

const promptText = customPrompt.addText({
  value: 'It\'s an important decision',
  xPosition: 0,
  yPosition: 50,
})

const promptTextBox = customPrompt.addTextBox({
  placeholder: 'Enter text',
  xPosition: 0,
  yPosition: -20,
  onChange: () => {
    console.log('addTextBox onChange')
  },
})

const promptCheckbox = customPrompt.addCheckbox({
  text: 'Don\'t show again',
  xPosition: -80,
  yPosition: -70,
  onCheck: () => {
    console.log('addCheckbox onCheck')
  },
  onUncheck: () => {
    console.log('addCheckbox onUncheck')
  },
})

const promptSwitch = customPrompt.addSwitch({
  text: 'Turn me',
  xPosition: -60,
  yPosition: -120,
  onCheck: () => {
    console.log('addSwitch onCheck')
  },
  onUncheck: () => {
    console.log('addSwitch onUncheck')
  },
})

const promptButtonE = customPrompt.addButton({
  style: ui.ButtonStyles.E,
  text: 'Yeah',
  xPosition: -100,
  yPosition: -200,
  onMouseDown: () => {
    console.log('addButton onMouseDown')
  },
})

const promptButtonF = customPrompt.addButton({
  style: ui.ButtonStyles.F,
  text: 'Nope',
  xPosition: 100,
  yPosition: -200,
  onMouseDown: () => {
    console.log('addButton onMouseDown')
  },
})

customPrompt.hide()

// customPrompt.show()

customPrompt.width = 800

promptTitle.textElement.textAlign = 'bottom-center'

promptText.textElement.textAlign = 'top-right'

promptTextBox.fillInBoxElement.placeholderColor = Color4.Yellow()

promptCheckbox.labelElement.fontSize = 12

promptButtonE.labelElement.color = Color4.Yellow()

promptSwitch.labelElement.color = Color4.Green()