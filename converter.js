const { converter, irregularMatcher } = require('./utils/prompt')
const { generateResponse } = require('./utils/proxy')
const { dirToSave } = require('./config')
const { german, english } = require('./bookFragment')
const fs = require('fs')
const path = require('path')

async function matchContent (german, english) {
  let response
  try {
    response = await generateResponse(converter(german, english), ['[', ']'])
  } catch (error) {
    throw error
  }

  const irregArr = extractContent(german, 1)

  if (Array.isArray(irregArr) && irregArr.length > 0) {
    let map = await generateResponse(
      irregularMatcher(
        irregArr,
        response.map(arr => arr[0])
      ),
      ['[', ']']
    )

    for (let i = 0; i < map.length; i++) {
      if (response[map[i]]) {
        response[map[i]][4] = irregArr[i]
      }
    }
  }

  return response
    .map(formatLine)
    .join('\n')
    .replace(/,\|/g, '.|')
    .replace(/daß |muß |muß,|muß\./g, match => {
      switch (match) {
        case 'daß ':
          return 'dass '
        case 'muß ':
          return 'muss '
        case 'muß,':
          return 'muss,'
        case 'muß.':
          return 'muss.'
        default:
          return match
      }
    })
}

function formatLine (line) {
  const [word, example_sentence, meaning, translation, irr = ''] = line

  return `${word}|${meaning}|${example_sentence}|${translation}|${irr}|`
}

async function processWords (german, english) {
  try {
    const responses = await matchContent(german, english)
    let content = '#html:false\n#separator:|\n'
    content = content + responses + '\n' + extractContent(english, 0).join('\n')

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
    match[0] = match[0].replace(/-\n/g, '')
    if (match[0][0] == ' ') {
      results.push('<' + match[0].slice(2))
    } else {
      results.push(match[0])
    }
  }
  return results
}

processWords(german.replace(/\[.*?\]/g, '').replace(/ \[.*?\]/g, ''), english)
