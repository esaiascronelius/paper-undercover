import { readFile, readdir } from "fs/promises"

/**
 * Get list of available dictionaries in the dictionaries directory.
 *
 * @returns {Promise<string[]>} List of available dictionaries.
 */
export const getDictionaries = async () => {
  const dictionaries = await readdir("./dictionaries")
  return dictionaries.map((dictionary) => dictionary.replace(".txt", ""))
}

/**
 * Get word pairs from a dictionary.
 *
 * @param {string} dictionary Name of the dictionary.
 */
export const getWordPairs = async (dictionary) => {
  const dictionaryFile = await readFile(
    `./dictionaries/${dictionary}.txt`,
    "utf8"
  )
  return dictionaryFile.split("\n").map((line) => line.split(","))
}
