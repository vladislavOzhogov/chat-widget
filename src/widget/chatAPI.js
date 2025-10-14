// export async function sendMessage(webhookUrl, message) {
//     const res = await fetch(webhookUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message })
//     })
  
//     if (!res.ok) throw new Error(`Webhook error: ${res.status}`)
//     const data = await res.json().catch(() => ({}))
//     return data?.reply || 'Bot reply (mocked)'
// }

export async function sendMessage(webhookUrl, message) {
    console.log('Pretending to send message to:', webhookUrl)
    console.log('Message:', message)
  
    // Simulate latency
    await new Promise((r) => setTimeout(r, 500))
  
    // Mock response for demo
    const mockReply = "Пример ответа бота-консультанта"

    const randomReply = mockReply
  
    return randomReply
  }