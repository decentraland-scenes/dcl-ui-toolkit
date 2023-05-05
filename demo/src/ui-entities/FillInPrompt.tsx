import * as ui from '@dcl-sdk/ui-utils'

export const fillInPrompt = ui.createComponent(ui.FillInPrompt, {
  title: 'What are you thinking?',
  onAccept: (value: string) => {
    console.log('fillInPrompt onAccept', value)
  },
  onClose: () => console.log('close fillInPrompt____________'),
})

// fillInPrompt.show()