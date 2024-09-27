const { meaningLookUp, irregularLookUp } = require('./utils/prompt')
const { generateResponse } = require('./utils/proxy')
const { dirToSave } = require('./config')
const fs = require('fs')
const path = require('path')


async function lookUp (word) {
  const dict = await generateResponse( meaningLookUp(word), ['{', '}'])
  const irregular = await generateResponse( irregularLookUp(word), ['[', ']'])

  return formatResponse(dict, irregular)
}

function formatResponse (dict, irregular) {
  const { word, meaning, example_sentence, translation } = dict

  return `${word};${meaning};${example_sentence};${translation};${
    irregular.length > 0 ? '<' + irregular.join(', ') + '>' : ''
  };`
}

async function processWords (words) {
  const promises = words.map(word => lookUp(word))
  try {
    const responses = await Promise.all(promises)
    let content = '#html:false\n#separator:;\n'
    content += responses.join('\n')

    const filePath = path.join( dirToSave, 'out.txt')
    fs.writeFileSync(filePath, content)
    console.log('Responses written to', filePath, 'successfully.')
  } catch (error) {
    console.error('Error occurred while processing words:', error)
  }
}

const inputWords = process.argv.slice(2)
processWords(inputWords)
