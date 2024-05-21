function prompt(word) {
    return `Generate a JSON object that contains the following information for a given German word:
    1. The English meaning of the given German word.
    2. An example sentence using the given German word.
    3. The translation of the example sentence into English.
    
    Format the JSON object as follows:
    {
      "word": "[word]",
      "meaning": "English meaning of the word",
      "example_sentence": "An example sentence using the word in German",
      "translation": "The translation of the example sentence into English"
    }
    
    Here are a few examples:
    
    Example 1:
    {
      "word": "Haus",
      "meaning": "house",
      "example_sentence": "Das Haus ist groß.",
      "translation": "The house is big."
    }
    
    Example 2:
    {
      "word": "essen",
      "meaning": "to eat",
      "example_sentence": "Ich esse einen Apfel.",
      "translation": "I am eating an apple."
    }
    
    Now, generate the JSON object for the word: ${word}.
    `
}
module.exports = {
    prompt
}
