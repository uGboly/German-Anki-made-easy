# German Anki Made Easy

**German Anki Made Easy** is a tool designed to help learners efficiently create and organize Anki flashcards for German vocabulary. It offers two main features:

1. **Automated Anki Card Creation**: Uses the OpenAI API to generate Anki cards for German words.
2. **Vocabulary Categorization**: Organizes words from your Anki deck by prefixes, stems, and synonyms, providing clear and structured summaries.

## Getting Started

### 1. Install Dependencies

Begin by installing the required dependencies:

```bash
npm install
```

### 2. Configure the API

Create a `config.js` file in the project directory to configure the API settings. Use the following template:

```javascript
module.exports = {
    apiKey: 'xxx', 
    dirToSave: 'xxx' 
}
```

- Replace `'xxx'` with your API key.
- Set `dirToSave` to the directory where output files will be saved.

### 3. Set Up Anki Note and Card Types

Before using the tool, create a custom Note type in Anki with the following six fields:

1. **German Word**
2. **English Translation**
3. **German Example Sentence**
4. **English Translation of Example Sentence**
5. **Irregular Forms**
6. **Notes**

Next, set up two Card Types:

- **Card Type 1**: The front displays only the **German Word**, while the back shows all six fields.
- **Card Type 2**: The front displays only the **English Translation**, while the back shows all six fields.

This setup allows you to review vocabulary in both directions:
- **German to English**
- **English to German**

Once the generated file is imported into Anki, it will automatically create two flashcards for each word based on these Card Types.

## Usage

### 1. Generate Anki Cards

To generate Anki cards for a list of German words, run the following command in the terminal:

```bash
node index.js German_word_1 German_word_2 ... German_word_n
```

This will create an `out.txt` file in the directory specified in your `config.js`. You can import this file into Anki as Notes, and Anki will automatically generate the corresponding flashcards.

### 2. Categorize Vocabulary from Anki Deck

To categorize words from your Anki deck, export the deck as **Notes in Plain Text (.txt)** format and save it in the directory defined by `dirToSave` in `config.js`.

Then, run the following command:

```bash
node categorizeWords.js
```

This will generate three Excel files:

- `prefixes.xlsx`
- `stems.xlsx`
- `synonyms.xlsx`

These files will contain summaries of your deck’s vocabulary, categorized by prefixes, stems, and synonyms for easier review and organization.