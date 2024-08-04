const fs = require('fs')
const path = require('path')
const { germanPrefixes, germanVerbs } = require('./categories')
const { dirToSave } = require('./config')

const isPrefix = +process.argv[2]
const inputPath = path.join(dirToSave, 'deck.txt')
const outputPath = path.join(dirToSave, isPrefix ? 'prefixes.txt' : 'stem.txt')

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('无法读取文件:', err)
    return
  }

  const article = ['das ', 'der ', 'die ']
  let wordsArray = data
    .split('\n')
    .map(line => line.split('\t').slice(0, 2))
    .filter(
      word =>
        !article.reduce((prev, curr) => {
          prev || word[0].startsWith(curr)
        }, false)
    )

  const category2words = categorizeWords(wordsArray, isPrefix)
  printCategorizedWords(category2words)
})

function categorizeWords (wordsArray, isPrefix = true) {
  const categories = isPrefix ? germanPrefixes : germanVerbs
  const category2words = {}

  categories.forEach(category => {
    category2words[category] = []
  })

  if (isPrefix) {
    wordsArray.forEach(word => {
      let found = false
      for (let category of categories) {
        if (word[0].startsWith(category)) {
          category2words[category].push(
            word
              .join('|')
              .replace(/<[^>]*>/g, '')
              .replace(/"/g, '')
          )
          found = true
          break
        }
      }
    })
  } else {
    wordsArray.forEach(word => {
      let found = false
      for (let category of categories) {
        if (word[0].endsWith(category)) {
          category2words[category].push(
            word
              .join('|')
              .replace(/<[^>]*>/g, '')
              .replace(/"/g, '')
          )
          found = true
          break
        }
      }
    })
  }

  return category2words
}

function printCategorizedWords (category2words) {
  const sortedWordsList = Array.from(Object.entries(category2words))
  sortedWordsList.sort((a, b) => b[1].length - a[1].length)

  let output = ''

  for (const [category, words] of sortedWordsList) {
    if (words.length > 0) {
      output += category + '\n'
      words.forEach(word => {
        output += word + '\n'
      })
      output += '\n'
    }
  }

  fs.writeFileSync(outputPath, output)
  console.log('Results written to', outputPath, 'successfully.')
}
