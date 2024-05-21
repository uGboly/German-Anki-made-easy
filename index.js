const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID } = require('./key')
const { prompt } = require('./prompt')

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponce (word) {
  const { choices } = await client.getChatCompletions(deploymentID, [
    { role: 'user', content: prompt(word) }
  ])

  let response = choices[0].message.content
  const firstIndex = response.indexOf('{')
  const lastIndex = response.lastIndexOf('}')
  response = response.substring(firstIndex, lastIndex + 1)

  return new Promise((resolve, reject) => {
    try {
      response = JSON.parse(response)
      resolve(response)
    } catch (e) {
      reject(e)
    }
  })
}


