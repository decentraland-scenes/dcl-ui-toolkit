import * as ui from '@dcl-sdk/ui-utils'

export const optionPrompt = ui.createComponent(ui.OptionPrompt, {
  title: 'Pick an option!',
  text: 'What will you choose?',
  onAccept: () => {
    optionPrompt.hide()
    console.log('optionPrompt onAccept')
  },
  onReject: () => {
    optionPrompt.hide()
    console.log('optionPrompt onReject')
  },
  onClose: () => console.log('close optionPrompt____________'),
})

// optionPrompt.show()