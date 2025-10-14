import { createChatUI } from './chatUI.js'
import { sendMessage } from './chatAPI.js'

export function initChatWidget({ webhookUrl }) {
  let root = document.getElementById('chat-widget-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'chat-widget-root'
    document.body.appendChild(root)
  }

  // 🔒 Prevent inheritance / leaking styles
  root.style.all = 'unset'
  root.style.position = 'fixed'
  root.style.bottom = '1.5rem'
  root.style.right = '1.5rem'
  root.style.zIndex = '9999'

  const ui = createChatUI(root)

  ui.onSend(async (message) => {
    ui.addMessage('user', message)
    try {
      const response = await sendMessage(webhookUrl, message)
      ui.addMessage('bot', response)
    } catch (err) {
      ui.addMessage('bot', '⚠️ Error contacting server.')
      console.error(err)
    }
  })
}