import dotenv from 'dotenv';

dotenv.config();

export interface viletaintBotConfig {
  meme: string;
  minimumWordsBeforeviletaintification: number;
  wordsToPossiblyviletaint: number;
  negativeThreshold: number;
  chanceToviletaint: number;
  viletaintBuffer: number;
  viletaintAI: 0 | 1;
  breakTheFirstRuleOfviletaintbotics: boolean;
  apiPort: number;
}

const config: viletaintBotConfig = {
  apiPort: Number(process.env.API_PORT) || 3000,
  meme: process.env.BOT_MEME || 'viletaint',
  minimumWordsBeforeviletaintification:
    Number(process.env.BOT_MINIMUM_BEFORE_viletaintIFY) || 3,
  wordsToPossiblyviletaint: Number(process.env.BOT_WORDS_TO_POSSIBLY_viletaint) || 3,
  negativeThreshold: Number(process.env.BOT_NEGATIVE_THRESHOLD) || -10,
  chanceToviletaint: parseFloat(process.env.BOT_CHANCE) || 0.05,
  viletaintBuffer: Number(process.env.BOT_viletaint_BUFFER) || 10,
  viletaintAI: 1,
  // WARNING
  // IF YOU CHANGE THE FOLLOWING THE POLICE CAN MAYBE TAKE YOU TO JAIL
  breakTheFirstRuleOfviletaintbotics: false,
};

export default config;
