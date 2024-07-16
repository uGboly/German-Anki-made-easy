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
      console.log(error)
    }
  }
}

async function matchContent (german, english) {
  const response = await generateResponse(converter(german, english), [
    '[',
    ']'
  ])

  return response.map(formatLine).join('\n').replace(/,\|/g, '.|')
}

function formatLine (line) {
  const [word, example_sentence, meaning, translation] = line

  return `${word}|${meaning}|${example_sentence}|${translation}||`
}

async function processWords (german, english) {
  try {
    const responses = await matchContent(german, english)
    let content = '#html:false\n#separator:|\n'
    content =
      content +
      responses +
      '\n' +
      extractContent(german, 1).join('\n') +
      '\n' +
      extractContent(english, 0).join('\n')

    const filePath = path.join(dirToSave, 'words.txt')
    fs.writeFileSync(filePath, content)
    console.log('Responses written to', filePath, 'successfully.')
  } catch (error) {
    console.log('Error occurred while processing words:', error)
  }
}

function extractContent (str, mode) {
  const results = []
  let regex

  if (mode === 0) {
    regex = /\(([^)]+)\)/g // 匹配括号 ()
  } else if (mode === 1) {
    regex = /<([^>]+)>| c([^>]+)>/g // 匹配尖括号 <>
  } else {
    throw new Error(
      'Invalid mode. Use 0 for parentheses and 1 for angle brackets.'
    )
  }

  let match
  while ((match = regex.exec(str))) {
    if (match[0][0] == ' ') {
      results.push('<' + match[0].slice(2))
    } else {
      results.push(match[0])
    }
  }
  return results
}

processWords(german.replace(/\[.*?\]/g, '').replace(/ \[.*?\]/g, ''), english)