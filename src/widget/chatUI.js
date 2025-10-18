export function createChatUI(root) {
  const template = document.getElementById('chatWidgetContainer')
  const messagesEl = template.querySelector('#messages')
  const inputEl = template.querySelector('#chatInput')
  const sendBtn = template.querySelector('#sendBtn')

  function animateMessage(el) {
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }

  function showTyping() {
    const el = document.createElement('div')
    el.className = 'text-left mb-3 bot-typing'
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    el.innerHTML = `
      <div class="text-left text-xs text-gray-500 mb-1">Aimaq • ${time}</div>
      <div class="inline-block px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
        <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
    `
    messagesEl.appendChild(el)
    messagesEl.scrollTop = messagesEl.scrollHeight
    animateMessage(el)
    return el
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.remove()
  }

  function addMessage(sender, text, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const el = document.createElement('div')
        el.className = `flex items-start mb-3 ${sender === 'user' ? 'justify-end' : 'justify-start'}`
  
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const name = sender === 'user' ? 'Вы' : 'Aimaq'
  
        const avatar = sender === 'user'
          ? `<div class="w-8 h-8 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mr-2">U</div>`
          : `<div class="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold mr-2">AI</div>`
  
        const messageBubble = `
          <div class="max-w-[75%]">
            <div class="text-xs text-gray-500 mb-1">${name} • ${time}</div>
            <div class="inline-block px-3 py-2 rounded-lg ${
              sender === 'user'
                ? 'message-color'
                : 'bg-gray-100 text-gray-800'
            }">${text}</div>
          </div>
        `
  
        el.innerHTML = `
          ${avatar}
          ${messageBubble}
        `
  
        messagesEl.appendChild(el)
        messagesEl.scrollTop = messagesEl.scrollHeight
        animateMessage(el)
        resolve(el)
      }, delay)
    })
  }

  function addFeedbackPrompt(onClick) {
    const typing = showTyping()
    setTimeout(() => {
      removeTyping(typing)
      const el = document.createElement('div')
      el.className = 'text-left mb-3 feedback-prompt ml-10'
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
      el.innerHTML = `
        <div class="text-left text-xs text-gray-500 mb-1">Aimaq • ${time}</div>
        <div class="inline-block px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
          <p class="mb-2">Этот ответ помог?</p>
          <div class="flex gap-2 feedback-buttons">
            <button class="feedback-btn bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm border border-transparent outline-none">Да</button>
            <button class="feedback-btn bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm border border-transparent outline-none">Нет</button>
          </div>
        </div>
      `
  
      const buttons = Array.from(el.querySelectorAll('.feedback-btn'))
  
      function resetAll() {
        buttons.forEach((b) => {
          b.classList.remove('bg-transparent', 'border-2', 'border-red-500')
          b.classList.add('bg-gray-300', 'text-gray-800', 'border-transparent')
        })
      }
  
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          resetAll()
  
          // Highlight clicked button
          btn.classList.remove('bg-gray-300', 'border-transparent')
          btn.classList.add('bg-transparent', 'border-2', 'border-red-500', 'text-gray-800')
  
          // Disable all buttons after the first click
          buttons.forEach((b) => {
            b.disabled = true
            b.classList.add('opacity-60', 'cursor-not-allowed')
          })
  
          onClick(btn.textContent)
        })
      })
  
      messagesEl.appendChild(el)
      messagesEl.scrollTop = messagesEl.scrollHeight
      animateMessage(el)
    }, 1000)
  }  
  
  function addEmojiRating(onSelect) {
    const typing = showTyping()
    setTimeout(() => {
      removeTyping(typing)
      const el = document.createElement('div')
      el.className = 'text-left mb-3 ml-10'
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const emojis = [
        { id: 'sad', symbol: '\u{1F61E}', label: 'Плохо' },
        { id: 'neutral', symbol: '\u{1F610}', label: 'Нормально' },
        { id: 'happy', symbol: '\u{1F604}', label: 'Отлично' },
      ]

      el.innerHTML = `
        <div class="text-left text-xs text-gray-500 mb-1">Aimaq • ${time}</div>
        <div class="inline-block px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
          <p class="mb-2">Оцените мою работу</p>
          <div class="flex gap-4 text-2xl cursor-pointer select-none">
            ${emojis
              .map(
                (e) => `
                <span data-id="${e.id}" title="${e.label}" 
                  class="emoji-rating transition-transform hover:scale-125">${e.symbol}</span>`
              )
              .join('')}
          </div>
        </div>
      `

      const emojiEls = el.querySelectorAll('.emoji-rating')
      emojiEls.forEach((emoji) => {
        emoji.addEventListener('click', () => {
          const value = emoji.dataset.id
          emojiEls.forEach((e) => {
            e.style.pointerEvents = 'none'
            e.style.opacity = '0.5'
          })
          emoji.style.opacity = '1'
          const text =
            value === 'sad' ? 'Плохо 😞' : value === 'neutral' ? 'Нормально 😐' : 'Отлично 😄'
          onSelect(text)
        })
      })

      messagesEl.appendChild(el)
      messagesEl.scrollTop = messagesEl.scrollHeight
      animateMessage(el)
    }, 1000)
  }

  function removeFeedbackButtons() {
    const existingButtons = messagesEl.querySelectorAll('.feedback-buttons')
    existingButtons.forEach((btns) => btns.remove())
  }

  function onSend(callback) {
    sendBtn.onclick = () => {
      const message = inputEl.value.trim()
      if (!message) return
      removeFeedbackButtons()
      callback(message)
      inputEl.value = ''
    }

    // Also handle Enter key
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const message = inputEl.value.trim()
        if (!message) return
        removeFeedbackButtons()
        callback(message)
        inputEl.value = ''
      }
    })
  }

  function disableInput() {
    inputEl.disabled = true
    sendBtn.disabled = true
    inputEl.classList.add('opacity-50', 'cursor-not-allowed')
  }
  
  function enableInput() {
    inputEl.disabled = false
    sendBtn.disabled = false
    inputEl.classList.remove('opacity-50', 'cursor-not-allowed')
    inputEl.focus()
  }  

  root.appendChild(template)

  const chatContainer = root.querySelector('#chatWidgetContainer');
  const fullscreenBtn = chatContainer.querySelector('#fullscreenBtn');
  let isMinimized = false;
  
  const chatToggleButton = document.createElement('div');
  chatToggleButton.id = 'chatToggleButton';
  chatToggleButton.textContent = '💬';
  root.appendChild(chatToggleButton);  
  
  fullscreenBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    chatContainer.classList.toggle('minimized', isMinimized);
  
    if (isMinimized) {
      chatToggleButton.style.opacity = '1';
      chatToggleButton.style.pointerEvents = 'auto';
      chatToggleButton.style.transform = 'scale(1)';
    } else {
      chatToggleButton.style.opacity = '0';
      chatToggleButton.style.pointerEvents = 'none';
      chatToggleButton.style.transform = 'scale(0.8)';
    }
  });
  
  chatToggleButton.addEventListener('click', () => {
    isMinimized = false;
    chatContainer.classList.remove('minimized');
    chatToggleButton.style.opacity = '0';
    chatToggleButton.style.pointerEvents = 'none';
    chatToggleButton.style.transform = 'scale(0.8)';
  });

  return {
    addMessage,
    addFeedbackPrompt,
    addEmojiRating,
    showTyping,
    removeTyping,
    onSend,
    disableInput,
    enableInput,
  }
}