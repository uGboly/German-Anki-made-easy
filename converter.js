const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
const { azureApiKey, endpoint, deploymentID, dirToSave } = require('./config')
const { converter } = require('./prompt')
const { german, english } = require('./bookFragment')
const fs = require('fs')
const path = require('path')

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

async function generateResponse (prompt, separator) {
  let flag = true
  while (flag) {
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
      console.log(err)
    }
  }
}

async function matchContent (german, english) {
  const response = await generateResponse(converter(german, english), [
    '[',
    ']'
  ])

  return response.map(formatLine).join('\n')
}

function formatLine (line) {
  const [word, example_sentence, meaning, translation] =
    line

  return `${word};${meaning};${example_sentence};${translation};;`
}

async function processWords (german, english) {
  try {
    const responses = await matchContent(german, english)
    let content = '#html:false\n#separator:;\n'
    content += responses

    const filePath = path.join(dirToSave, 'words.txt')
    fs.writeFileSync(filePath, content)
    console.log('Responses written to', filePath, 'successfully.')
  } catch (error) {
    console.log('Error occurred while processing words:', error)
  }
}

processWords(german.replace(/\[.*?\]/g, ''), english)
