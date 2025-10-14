export function createChatUI(root) {
  const template = document.getElementById('chat-widget-template')
  const wrapper = template.content.cloneNode(true)
  const messagesEl = wrapper.querySelector('#messages')
  const inputEl = wrapper.querySelector('#chatInput')
  const sendBtn = wrapper.querySelector('#sendBtn')

  function addMessage(sender, text) {
    const el = document.createElement('div')
    el.className = sender === 'user' ? 'text-right' : 'text-left text-gray-700'
    el.innerHTML = `
      <div class="inline-block px-3 py-1 rounded-lg ${sender === 'user'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100'}">${text}</div>`
    messagesEl.appendChild(el)
    messagesEl.scrollTop = messagesEl.scrollHeight
  }

  function onSend(callback) {
    sendBtn.onclick = () => {
      const message = inputEl.value.trim()
      if (!message) return
      callback(message)
      inputEl.value = ''
    }
  }

  root.appendChild(wrapper)
  return { addMessage, onSend }
}
