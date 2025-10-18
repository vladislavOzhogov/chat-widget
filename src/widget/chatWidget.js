import { createChatUI } from './chatUI.js'
import { sendMessage } from './chatAPI.js'
import templateHTML from '../views/chatWidgetTemplate.html?raw'

export async function initChatWidget({ webhookUrl }) {
  let root = document.getElementById('chat-widget-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'chat-widget-root'
    document.body.appendChild(root)
  }

  const template = document.createElement('template')
  template.innerHTML = templateHTML
  root.appendChild(template.content.cloneNode(true))

  root.style.all = 'unset'
  root.style.position = 'fixed'
  root.style.bottom = '1.5rem'
  root.style.right = '1.5rem'
  root.style.zIndex = '9999'

  const ui = createChatUI(root)

  let botIsResponding = false

  async function greetBot() {
    const typing = ui.showTyping()
    await new Promise(r => setTimeout(r, 1200))
    ui.removeTyping(typing)
    await ui.addMessage('bot', 'Привет! Чем могу помочь?')
  }
  
  greetBot()  

  ui.onSend(async (message) => {
    if (botIsResponding) return
    botIsResponding = true
    ui.disableInput()
  
    await ui.addMessage('user', message)
    await new Promise((r) => setTimeout(r, 500))
  
    const typing = ui.showTyping()
  
    try {
      // Send to real webhook or mock
      const response = await sendMessage(webhookUrl, message)
  
      await new Promise((r) => setTimeout(r, 1200))
      ui.removeTyping(typing)
      await ui.addMessage('bot', response)
  
      // If this was not a feedback answer (Да / Нет / emoji), show feedback prompt
      if (!['да', 'нет', 'плохо 😞', 'нормально 😐', 'отлично 😄'].includes(message.trim().toLowerCase())) {
        await new Promise((res) => setTimeout(res, 700))
        ui.addFeedbackPrompt(async (choice) => {
          await ui.addMessage('user', choice)
          const typing2 = ui.showTyping()
          await new Promise((r) => setTimeout(r, 800))
          ui.removeTyping(typing2)
  
          const followup = await sendMessage(webhookUrl, choice)
          await ui.addMessage('bot', followup)
  
          // If “Да” → show emoji rating
          if (choice.trim().toLowerCase() === 'да') {
            setTimeout(() => {
              ui.addEmojiRating(async (emoji) => {
                await ui.addMessage('user', emoji)
                const typing3 = ui.showTyping()
                await new Promise((r) => setTimeout(r, 800))
                ui.removeTyping(typing3)
                const thanks = await sendMessage(webhookUrl, emoji)
                await ui.addMessage('bot', thanks)
                botIsResponding = false
                ui.enableInput()
              })
            }, 700)
          } else {
            // “Нет” → just reply and end
            botIsResponding = false
            ui.enableInput()
          }
        })
      } else {
        botIsResponding = false
        ui.enableInput()
      }
    } catch (err) {
      ui.removeTyping(typing)
      await ui.addMessage('bot', 'Ошибка при соединении с сервером.')
      console.error(err)
      botIsResponding = false
      ui.enableInput()
    }
  })
}