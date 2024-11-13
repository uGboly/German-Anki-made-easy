const OpenAI = require('openai')
const { apiKey } = require('../config')

const client = new OpenAI({ apiKey })

async function generateResponse (prompt, separator) {
  try {
    const { choices } = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o'
    })

    let response = choices[0].message.content
    const firstIndex = response.indexOf(separator[0])
    const lastIndex = response.lastIndexOf(separator[1])
    response = response.substring(firstIndex, lastIndex + 1)

    response = JSON.parse(response)
    return response
  } catch (error) {
    throw error
  }
}

module.exports = { generateResponse }
