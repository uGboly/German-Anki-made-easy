const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
const { germanPrefixes, germanVerbs } = require('./categories')
const { dirToSave } = require('./config')

const isPrefix = +process.argv[2]
const inputPath = path.join(dirToSave, 'deck.txt')
const outputPath = path.join(
  dirToSave,
  isPrefix ? 'prefixes.xlsx' : 'stem.xlsx'
)

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
          category2words[category].push(word)
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
          category2words[category].push(word)
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

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Categorized Words')
  worksheet.getColumn(1).width = 40
  worksheet.getColumn(2).width = 70
  const defaultFont = { size: 14 }

  for (const [category, words] of sortedWordsList) {
    if (words.length > 0) {
      const categoryRow = worksheet.addRow([category])
      categoryRow.font = { ...defaultFont, bold: true }
      words.forEach(word => {
        const row = worksheet.addRow([
          word[0],
          word[1].replace(/<[^>]*>/g, '').replace(/"/g, '')
        ])
        row.eachCell(cell => {
          cell.font = defaultFont
        })
      })
      const emptyRow = worksheet.addRow([])
      emptyRow.eachCell(cell => {
        cell.font = defaultFont
      })
    }
  }

  workbook.xlsx
    .writeFile(outputPath)
    .then(() => {
      console.log('Results written to', outputPath, 'successfully.')
    })
    .catch(error => {
      console.error('Error writing to Excel file:', error)
    })
}
