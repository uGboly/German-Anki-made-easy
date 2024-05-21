const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID } = require('./key')
const {prompt} = require('./prompt')

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponce(word){
    const { choices } = await client.getChatCompletions(
        deploymentID,
        [{ role: 'user', content: prompt(word) }]
      )
    console.log(choices[0].message.content)
}

generateResponce('Tür').catch(console.log)
