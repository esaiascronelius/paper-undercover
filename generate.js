import { writeFile } from "node:fs/promises"
import { stdin as input, stdout as output } from "node:process"
import * as readline from "node:readline/promises"
import { getDictionaries, getWordPairs } from "./dictionaries.js"

const rl = readline.createInterface({ input, output })

/**
 * Prompt user to select a dictionary.
 */
const dictionaries = await getDictionaries()
const dictionaryPrompt = `Select a dictionary (${dictionaries.join(", ")}): `
let dictionary
while (true) {
  dictionary = await rl.question(dictionaryPrompt)
  if (dictionaries.includes(dictionary)) {
    console.log(`You selected ${dictionary}.`)
    break
  }

  console.log(`The dictionary ${dictionary} does not exist.`)
}

/**
 * Promp user for the number of players.
 */
const playerPrompt = "How many players? "
let players
while (true) {
  players = parseInt(await rl.question(playerPrompt))
  if (players > 2) {
    console.log(`You selected ${players} players.`)
    break
  }

  console.log("You must have at least 3 players.")
}

/**
 * Prompt user for the number of undercovers.
 */
const undercoverPrompt = "How many undercovers? "
let undercovers
while (true) {
  undercovers = parseInt(await rl.question(undercoverPrompt))
  if (undercovers < players) {
    console.log(`You selected ${undercovers} undercovers.`)
    break
  }

  console.log("You must have fewer undercovers than players.")
}

/**
 * Prompt user for the number of mr. whites.
 */
const whitePrompt = "How many mr. whites? "
let whites
while (true) {
  whites = parseInt(await rl.question(whitePrompt))
  if (whites < players - undercovers) {
    console.log(`You selected ${whites} mr. whites.`)
    break
  }

  console.log("You must have fewer mr. whites than players minus undercovers.")
}

/**
 * Prompt user for the number of rounds.
 */
const roundPrompt = "How many rounds? "
let rounds
while (true) {
  rounds = parseInt(await rl.question(roundPrompt))
  if (rounds > 0) {
    console.log(`You selected ${rounds} rounds.`)
    break
  }

  console.log("You must have at least 1 round.")
}

/**
 * Get all word pairs from the dictionary
 * and shuffle them.
 */
const wordPairs = await getWordPairs(dictionary)
const shuffledWordPairs = wordPairs.sort(() => Math.random() - 0.5)

/**
 * Generate the HTML document.
 */
let html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Undercover</title>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
`

for (let i = 0; i < rounds; i++) {
  const wordPair = shuffledWordPairs.pop().sort(() => Math.random() - 0.5)
  const round = []
  for (let j = 0; j < undercovers; j++) round.push(wordPair[0])
  for (let j = 0; j < whites; j++) round.push("mr. white")
  while (round.length < players) round.push(wordPair[1])

  round.forEach((word) => {
    html += `
      <div class="card">
        <div class="card__content">
          <span>${word}</span>
        </div>
      </div>
    `
  })
}

html += `
  </body>
</html>
`

/**
 * Write the HTML document to a file.
 */
const filePathDate = new Date().toISOString().replace(/:/g, "-")
const filePath = `./output/${filePathDate} - ${dictionary} - ${players} players - ${undercovers} undercovers - ${whites} mr. whites - ${rounds} rounds.html`
await writeFile(filePath, html)
console.log(`Wrote HTML document to ${filePath}`)

rl.close()
