// Grab the fr.json and translate it to all languages in the languages array

// Load the json file
const fr = require("./traductions/fr.json");

// Load the languages array
const languages = require("./traductions/languages.json");

// Load the fs module
const fs = require("fs");
const axios = require("axios");
// Load the path module

languages.forEach(async language => {
    // Get all traductions of the fr.json file for the specified language via API
    Object.keys(fr).forEach(async key => {
        // Get the value of the key
        const value = fr[key];
        // Sleep the thread for a random amount of time between 0 and 10 second to avoid rate limit
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 10000)));

        // Get Translation of the key via Google Translate API
        const translation = await axios.get(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${language}&dt=t&q=${encodeURIComponent(value)}`
        );

        // Get the translation
        const translationValue = translation.data[0][0][0];
        console.log(`${language}: ${key} => ${translationValue}`);
        // Write the translation to the file
        fs.writeFileSync(`./translations/${language}.json`, JSON.stringify({ ...fr, [key]: translationValue }, null, 2));
    });
});