function meaningLookUp (word) {
  return `Generate a JSON object that contains the following information for a given German word:
    1. The part of speech of the given German word (noun, verb, etc.).
    2. The English meaning of the given German word.
    3. An example sentence using the given German word.
    4. The translation of the example sentence into English.
    5. The word with the appropriate article in German (if the word is a noun).
    
    Format the JSON object as follows:
    {
      "part_of_speech": "part of speech of the word",
      "word": "[article] [word]" (if the word is a noun),
      "meaning": "English meaning of the word",
      "example_sentence": "An example sentence using the word in German",
      "translation": "The translation of the example sentence into English",
    }
    
    Here are a few examples:
    
    Example 1 (Noun):
    {
      "part_of_speech": "noun",
      "word": "das Haus",
      "meaning": "house",
      "example_sentence": "Das Haus ist groß.",
      "translation": "The house is big.",
    }
    
    Example 2 (Verb - Infinitive):
    {
      "part_of_speech": "verb",
      "word": "essen",
      "meaning": "to eat",
      "example_sentence": "Ich esse einen Apfel.",
      "translation": "I am eating an apple.",
    }
    
    Example 3 (Verb - Infinitive):
    {
      "part_of_speech": "verb",
      "word": "sein",
      "meaning": "to be",
      "example_sentence": "Ich bin müde.",
      "translation": "I am tired.",
    }
        
    Now, generate the JSON object for the word: ${word}.
    `
}

function irregularLookUp (word) {
  return `Given a German word, identify its part of speech and if it's an irregular verb, output its irregular conjugations in the third person singular. Output the results as a JSON array. If the word is not a verb or has no irregular conjugations, output an empty array. For example, if the input is "sein", output ["ist", "war", "gewesen"]; if the input is "nennen", output ["nannte", "genannt"]; if the input is "Haus", output []; if the input is "angeben", output ["gibt an", "gab an", "angegeben"].

  Examples:
  
  1  Input: sein
     Output: ["ist", "war", "gewesen"]
  2  Input: nennen
     Output: ["nannte", "genannt"]
  3  Input: Haus
     Output: []
  4  Input: angeben
     Output: ["gibt an", "gab an", "angegeben"]
     Instructions:

    1 Identify the part of speech of the given German word.
    2 If the word is a verb and has irregular conjugations, output its irregular conjugations in the third person singular form as a JSON array.
    3 If the word is not a verb or has no irregular conjugations, output an empty array.

    Now, generate the JSON array for the word: ${word}.
  `
}

function converter (german, english) {
  return `I will give you a fragment of a German vocabulary book, which is divided into two halves: the German part and the English part. The German part includes German words and German example sentences. For nouns, it places the corresponding definite article before the word. The English part includes the English translation of the German word and the English translation of the German example sentence. Your task is to match each German word and its example sentences with their English translations. Output a JSON array, where each item is an array of strings. The first item is the German word (if it is a noun, include the definite article before the word), the second item is the German example sentence (if there are multiple, separate them with a space; if there are none, use an empty string), the third item is the English translation of the word, and the fourth item is the English translation of the example sentence (if there are multiple, separate them with a white space; if there are none, use an empty string).No extra output.
The German part is as follows:
\`\`\`${german}\`\`\`
The English part is as follows:\`\`\`${english}\`\`\``
}

function irregularMatcher (irr, words) {
  return `I will give you two arrays. Each item in array A represents the irregular changes of an irregular German verb. Array B is a list of German words. Your task is to find the German word in array B that matches each item in array A. Output a JSON array of the same length as array A, where each item represents the index of the corresponding German word in array B.

For example:
Input
Array A: ["<zog, gezogen>", "<hob, gehoben>"]
Array B: ["gebrauchen","die Gebrauchsanweisung","anmachen","ausmachen","drücken","füllen","schütteln","anzünden","kaputtmachen","ziehen","heben"]
Output: [9, 10]

Now, generate the JSON array for the following Array A and Array B: 
Array A: ${irr}
Array B: ${words}
No extra output.
`
}

module.exports = {
  meaningLookUp,
  irregularLookUp,
  converter,
  irregularMatcher
}
