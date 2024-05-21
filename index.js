const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID } = require('./key')
const { meaningLookUp, irregularLookUp } = require('./prompt')
const fs = require('fs')
const path = require('path')

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponse (word, prompt, separator) {
  try {
    const { choices } = await client.getChatCompletions(deploymentID, [
      { role: 'user', content: prompt(word) }
    ])

    let response = choices[0].message.content
    const firstIndex = response.indexOf(separator[0])
    const lastIndex = response.lastIndexOf(separator[1])
    response = response.substring(firstIndex, lastIndex + 1)

    return JSON.parse(response)
  } catch (error) {
    return JSON.parse(separator.join(''))
  }
}

async function lookUp (word) {
  const dict = await generateResponse(word, meaningLookUp, ['{', '}'])
  const irregular = await generateResponse(word, irregularLookUp, ['[', ']'])

  return formatResponse(dict, irregular)
}

function formatResponse (dict, irregular) {
  const { word, meaning, example_sentence, translation } = dict

  return `${word};${meaning};${example_sentence};${translation};${
    irregular.length > 0 ? '<' + irregular.join(', ') + '>' : ''
  }`
}

async function processWords (words) {
  const promises = words.map(word => lookUp(word))
  try {
    const responses = await Promise.all(promises)
    let content = '#html:false\n#separator:;\n'
    content += responses.join('\n')

    const filePath = path.join('/Users/loserzhang/downloads', 'out.txt')
    fs.writeFileSync(filePath, content)
    console.log('Responses written to', filePath, 'successfully.')
  } catch (error) {
    console.error('Error occurred while processing words:', error)
  }
}

const inputWords = process.argv.slice(2)
processWords(inputWords)
