const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID } = require('../config')

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponse (prompt, separator) {
  try {
    const { choices } = await client.getChatCompletions(deploymentID, [
      { role: 'user', content: prompt }
    ])

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
