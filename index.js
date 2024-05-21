const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID } = require('./key')
const { prompt } = require('./prompt')
const fs = require('fs')
const path = require('path');

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponse (word) {
  try {
    const { choices } = await client.getChatCompletions(deploymentID, [
      { role: 'user', content: prompt(word) }
    ])

    let response = choices[0].message.content
    const firstIndex = response.indexOf('{')
    const lastIndex = response.lastIndexOf('}')
    response = response.substring(firstIndex, lastIndex + 1)

    return formatResponse(JSON.parse(response))
  } catch (error) {
    throw error
  }
}

function formatResponse (response) {
  const { word, meaning, example_sentence, translation, irregular } = response

  return `${word};${meaning};${example_sentence};${translation};${
    irregular.length > 0 ? '<' + irregular.join(', ') + '>' : ''
  }`
}

async function processWords (words) {
  const promises = words.map(word => generateResponse(word))
  try {
    const responses = await Promise.all(promises)
    let content ="#html:false\n#separator:;\n"
    content += responses.join('\n')

    const filePath = path.join('/Users/loserzhang/downloads', 'out.txt');
    fs.writeFileSync(filePath, content);
    console.log('Responses written to', filePath, 'successfully.');
  } catch (error) {
    console.error('Error occurred while processing words:', error)
  }
}

const inputWords = process.argv.slice(2)
processWords(inputWords)
