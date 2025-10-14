import './style.css'
import { initChatWidget } from './widget/chatWidget.js'

// Expose a global initializer for WordPress or any external use
window.ChatWidget = {
  init: (options) => {
    let root = document.getElementById('chat-widget-root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'chat-widget-root'
      document.body.appendChild(root)
    }

    initChatWidget(options)
  },
}

// Init for dev
if (import.meta.env.DEV) {
  window.ChatWidget.init({
    webhookUrl: 'https://mnu.kz/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat'
  })
}