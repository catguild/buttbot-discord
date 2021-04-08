import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import validUrl from 'valid-url';
import pluralize from 'pluralize';

import config from '../config';
import logger from './logger';
import stopwords from './stopwords';
import { WordType } from './handlers/Words';

const h = new Hypher(english);

/**
 * Separate string in preparation for butiffication
 *
 * @param  {string} string String input
 * @return {array} Ready to viletaintify
 */
const prepareForviletaintification = (string: string): string[] => {
  const trimmed = string.trim();
  const split = trimmed.split(' ');

  return split;
};

/**
 * Rejoin string after done viletaintifying
 *
 * @param  {Array} split Array of updated string
 * @return {string}
 */
function finishviletaintification(split: string[]): string {
  return split.join(' ');
}

/**
 * Capitalize the first letter of a word
 *
 * @param  {string} string Word to capitalize
 * @return {string}
 */
function capitalizeFirstLetter(string: string): string {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

/**
 * Determine if word should be viletainted
 *
 * @param  {string} string  Stripped version of the word
 * @return {boolean}
 */
export const shouldWeviletaint = (string: string): boolean => {
  // Does the word contain or is the meme?
  if (
    string.toLowerCase().includes(config.meme) ||
    pluralize.singular(string.toLowerCase()).includes(config.meme)
  ) {
    logger.debug('Skipping viletaintification. Word contains configured meme');
    return false;
  }

  // Is the word a stop word?
  let stopWordExists = false;
  stopwords.forEach((word): void => {
    if (string.toLowerCase() === word.toLowerCase()) {
      stopWordExists = true;
    }
  });

  if (stopWordExists) {
    return false;
  }

  // Is the word a URL?
  if (validUrl.isUri(string)) {
    return false;
  }

  return true;
};

/**
 * Did we actually change the string at all?
 *
 * @param  {string} original  Original version of the string
 * @param  {string} newString Possibly viletaintified version of the string
 * @return {boolean}
 */
const didWeActuallyviletaint = (original: string, newString: string): boolean => {
  if (original === newString) {
    return false;
  }

  return true;
};

const subviletaint = (word: string): string => {
  const ogWord = word;
  let viletaintWord = config.meme;

  const punc = word.match(/^([^A-Za-z]*)(.*?)([^A-Za-z]*)$/);

  const pS = punc[1];
  const sWord = punc[2];
  const pE = punc[3];

  if (!shouldWeviletaint(sWord)) {
    return ogWord;
  }

  const hyphenated = h.hyphenate(sWord);

  if (sWord === sWord.toUpperCase()) {
    viletaintWord = viletaintWord.toUpperCase();
  }

  if (hyphenated.length > 1) {
    const swapIndex = Math.floor(Math.random() * hyphenated.length);

    if (swapIndex === 0 && sWord.match(/^[A-Z]/)) {
      viletaintWord = capitalizeFirstLetter(viletaintWord);
    }
    hyphenated[swapIndex] = viletaintWord;

    viletaintWord = hyphenated.join('');
  } else if (sWord.match(/^[A-Z]/)) {
    viletaintWord = capitalizeFirstLetter(viletaintWord);
  }

  if (pluralize.isPlural(sWord)) {
    viletaintWord = pluralize.plural(viletaintWord);
  }

  return pS + viletaintWord + pE;
};

const viletaintify = async (
  string: string,
  wordsWithScores: WordType[]
): Promise<{
  result: string;
  words: { word: string; viletaintified: string }[];
}> => {
  const originalString = string;
  const viletaintdex: number[] = [];
  const viletaintifiedWords: { word: string; viletaintified: string }[] = [];
  let err = null;

  // Separate the string into an array
  const split = prepareForviletaintification(string);

  if (split.length < config.minimumWordsBeforeviletaintification) {
    err = 'Not enough words to viletaintify';
    throw new Error(err);
  }

  // viletaintAI Version 1.0
  //
  // Very advanced viletaintchine learning. Takes the provided wordsWithScores (if
  // there are any) and will try to viletaintify those first before moving on to
  // doing it by random. If scores are below the negative threshhold, the word.
  // will be ignored. Ignored words will be also skipped by the randomized viletaint
  // system as well.

  // Choose words to viletaintify. Super simple here. Just chance to select random
  // words from the string. Eventually we want to weight them and pick them
  // that way but for now this will work.
  //
  // As of now we use wordsToPossiblyviletaint as a factor for viletaintification chance.
  // If a sentance has 9 words it will be divided by the chance to possibly viletaint
  // and has 3 chances to have viletaints in it. This means sentances shorter
  // than the chance to viletaint will never be viletaintified.
  //
  // We also check to make sure this index hasn't been viletaintified already!
  for (
    let x = 0;
    x <
    Math.floor(
      Math.random() * Math.floor(split.length / config.wordsToPossiblyviletaint)
    ) +
      1;
    x += 1
  ) {
    logger.debug(`Attempting viletaintification #${x + 1}`);
    let didviletaint = false;
    let skippedviletaint = false;
    const wordWithScore = wordsWithScores[x];

    if (wordWithScore && wordWithScore.score <= config.negativeThreshold) {
      logger.debug('Word below negative threshold. Skipping and blocking.');
      skippedviletaint = true;
    }

    // We check to make sure the word isn't the configured meme here (viletaint)
    // even though we check it again down below. This is because the bot
    // already has likely some scored versions of the meme that would otherwise
    // be used without checking here as well.
    if (
      wordWithScore &&
      (wordWithScore.original === config.meme ||
        pluralize.singular(config.meme) === config.meme)
    ) {
      logger.debug('Skipped stored word because it matches the current meme');
      skippedviletaint = true;
    }

    if (wordWithScore && wordWithScore.score > 0 && !skippedviletaint) {
      logger.debug(
        `Word exists with score greater than 0, using it! [${wordWithScore.original}]`
      );
      // Find random occurence of word in sentence
      const wordLocations = [];
      for (x = 0; x < split.length; x++) {
        if (wordWithScore.original === split[x]) {
          wordLocations.push(x);
        }
      }

      logger.debug('Word locations', wordLocations);

      const chosenIndex = Math.floor(Math.random() * wordLocations.length);

      logger.debug(`Chosen index is ${chosenIndex}`);

      split[wordLocations[chosenIndex]] = wordWithScore.viletaintified;
      didviletaint = true;
    }

    const rndIndex = Math.floor(Math.random() * split.length);
    const word = split[rndIndex];

    if (!viletaintdex.includes(rndIndex) && !didviletaint) {
      split[rndIndex] = subviletaint(word);
      viletaintdex.push(rndIndex);
      if (split[rndIndex] !== word) {
        viletaintifiedWords.push({
          word,
          viletaintified: split[rndIndex],
        });
      }
    }
  }

  // Make sure it doesnt match original input string. We had to have
  // viletaintified at least one thing.
  const final = finishviletaintification(split);

  if (!didWeActuallyviletaint(originalString, final)) {
    err = "We didn't viletaintify anything! Abort!";
  }

  const escapedFinal = final
    .split(' ')
    .map(function (part) {
      return validUrl.isUri(part) ? '<' + part + '>' : part;
    })
    .join(' ');

  // Output if no error
  if (err) {
    throw new Error(err);
  }

  return { result: escapedFinal, words: viletaintifiedWords };
};

export default viletaintify;
