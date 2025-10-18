// export async function sendMessage(webhookUrl, message) {
//     const res = await fetch(webhookUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message })
//     })
  
//     if (!res.ok) throw new Error(`Webhook error: ${res.status}`)
//     const data = await res.json().catch(() => ({}))
//     return data?.reply
// }

export async function sendMessage(webhookUrl, message) {
  console.log('Pretending to send message to:', webhookUrl)

  // Simulate latency
  await new Promise((r) => setTimeout(r, 500))

  const normalized = message.trim().toLowerCase()
  let mockReply = "Пример ответа бота-консультанта"

  if (normalized === 'да') {
    mockReply = 'Если появятся ещё вопросы — возвращайтесь сюда в любое время.'
  } else if (normalized === 'нет') {
    mockReply = 'Понял, постараюсь ответить лучше в следующий раз.'
  } else if (['плохо 😞', 'нормально 😐', 'отлично 😄'].includes(normalized)) {
    mockReply = 'Спасибо за вашу оценку!'
  } else {
    // Default reply for initial messages
    mockReply = 'Пример ответа бота-консультанта'
  }

  return mockReply
}