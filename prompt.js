function prompt(word) {
    return `Generate a JSON object that contains the following information for a given German word:
    1. The part of speech of the given German word (noun, verb, etc.).
    2. The English meaning of the given German word.
    3. An example sentence using the given German word.
    4. The translation of the example sentence into English.
    5. The word with the appropriate article in German (if the word is a noun).
    6. An array of irregular forms (if applicable) for the given word.
    
    Format the JSON object as follows:
    {
      "part_of_speech": "part of speech of the word",
      "word": "[article] [word]" (if the word is a noun),
      "meaning": "English meaning of the word",
      "example_sentence": "An example sentence using the word in German",
      "translation": "The translation of the example sentence into English",
      "irregular": ["irregular forms (if any)"]
    }
    
    Here are a few examples:
    
    Example 1 (Noun):
    {
      "part_of_speech": "noun",
      "word": "das Haus",
      "meaning": "house",
      "example_sentence": "Das Haus ist groß.",
      "translation": "The house is big.",
      "irregular": []
    }
    
    Example 2 (Verb - Infinitive):
    {
      "part_of_speech": "verb",
      "word": "essen",
      "meaning": "to eat",
      "example_sentence": "Ich esse einen Apfel.",
      "translation": "I am eating an apple.",
      "irregular": []
    }
    
    Example 3 (Verb with irregular forms):
    {
      "part_of_speech": "verb",
      "word": "sein",
      "meaning": "to be",
      "example_sentence": "Ich bin müde.",
      "translation": "I am tired.",
      "irregular": ["ist", "war", "gewesen"]
    }
        
    Now, generate the JSON object for the word: ${word}.
    `
}
module.exports = {
    prompt
}
