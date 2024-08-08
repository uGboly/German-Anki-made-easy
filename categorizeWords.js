const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
const { germanPrefixes, germanVerbs, enBlackList } = require('./categories')
const { dirToSave } = require('./config')

const inputPath = path.join(dirToSave, 'deck.txt')

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('无法读取文件:', err)
    return
  }

  let wordsArray = data.split('\n').map(line => line.split('\t').slice(0, 2))

  for (let mode of [0, 1, 2]) {
    const category2words = categorizeWords(wordsArray, mode)
    printCategorizedWords(category2words, mode)
  }
})

function categorizeWords (wordsArray, mode) {
  const category2words = {}

  if (mode != 2) {
    categorizeWordsByForm(wordsArray, category2words, mode)
  } else {
    categorizeWordsByMeaning(wordsArray, category2words)
  }

  return category2words
}

function categorizeWordsByForm (wordsArray, category2words, mode) {
  const categories = mode ? germanPrefixes : germanVerbs

  categories.forEach(category => {
    category2words[category] = []
  })

  wordsArray.forEach(word => {
    let found = false
    for (let category of categories) {
      if (
        (mode && word[0].startsWith(category)) ||
        (!mode && word[0].endsWith(category))
      ) {
        category2words[category].push(word)
        found = true
        break
      }
    }
  })
}

function categorizeWordsByMeaning (wordsArray, category2words) {
  wordsArray = wordsArray.filter(
    word => word[1] && word[1].split(' ').length <= 5
  )

  const meanings = wordsArray
    .map(word => word[1].split(' '))
    .flat()
    .filter(enWord => enWord.length > 1 && !containsPunctuation(enWord))

  const meaningSet = new Set(meanings)
  enBlackList.forEach(prep => meaningSet.delete(prep))

  const categories = Array.from(meaningSet.keys())
  categories.forEach(category => {
    category2words[category] = []
  })

  wordsArray.forEach(word => {
    for (let enWord of word[1].split(' ')) {
      if (meaningSet.has(enWord)) {
        category2words[enWord].push(word)
      }
    }
  })
}

function containsPunctuation (str) {
  const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/
  return punctuationRegex.test(str)
}

function printCategorizedWords (category2words, mode) {
  const outputPath = path.join(
    dirToSave,
    (mode === 0 ? 'stem' : mode === 1 ? 'prefixes' : 'synonyms') + '.xlsx'
  )

  const sortedCategoriesList = Array.from(
    Object.entries(category2words)
  ).filter(category => category[1].length > 1)
  sortedCategoriesList.sort((a, b) => b[1].length - a[1].length)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Categorized Words')
  worksheet.getColumn(1).width = 45
  worksheet.getColumn(2).width = 70
  const defaultFont = { size: 14 }
  const emptyRowFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF808080' }
  }

  for (const [category, words] of sortedCategoriesList) {
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
      const emptyRow = worksheet.addRow(['',''])
      emptyRow.eachCell(cell => {
        cell.font = defaultFont
        cell.fill = emptyRowFill
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
