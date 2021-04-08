import Discord, { TextChannel, MessageReaction } from 'discord.js';

import logger from '../core/logger';
import {
  commandAbout,
  commandFirstRule,
  commandUnknown,
  commandHelp,
  commandviletaintifyCount,
} from './commands/generalCommands';
import viletaintify, { shouldWeviletaint } from '../core/viletaint';
import {
  commandServerWhitelist,
  commandServerAccess,
  commandServerSetting,
} from './commands/serverCommands';
import servers from '../core/handlers/Servers';
import wordsDb from '../core/handlers/Words';
import baseConfig from '../config';

const BOT_SYMBOL = '?';

type CommandReturnTypes = ReturnType<
  | typeof commandAbout
  | typeof commandHelp
  | typeof commandFirstRule
  | typeof commandviletaintifyCount
  | typeof commandServerWhitelist
  | typeof commandServerAccess
  | typeof commandServerSetting
  | typeof commandUnknown
>;

class BotController {
  public client = new Discord.Client();

  public connect = (): void => {
    this.client.login(process.env.DISCORD_BOT_TOKEN);

    this.client.on('ready', () => {
      logger.info('Welcome to viletaintBot (Discord Edition)');
      logger.info(
        "Remember! Isaac viletaintimov's First Rule of viletaintbotics: Don't let viletaintbot reply to viletaintbot."
      );
      logger.info('Connected to Discord');

      this.client.user.setPresence({
        activity: { name: 'viletaintbot.net | ?viletaint about' },
      });
    });

    this.client.on('error', (error) => {
      logger.error(`Something went wrong. Reason: ${error.message}`);
    });
  };

  public prepare = (): void => {
    this.loadListeners();
  };

  private loadListeners = (): void => {
    this.client.on('message', (message) => {
      if (message.content.match(/^\?viletaint(.*)/)) {
        this.handleCommand(message);
      } else {
        this.handleviletaintChance(message);
      }
    });
  };

  public handleCommand = async (message: Discord.Message): Promise<void> => {
    const command = message.content
      .replace(`${BOT_SYMBOL}viletaint `, '')
      .split(' ');

    logger.info(command);

    try {
      switch (command[0]) {
        case 'about':
          commandAbout(message);
          break;
        case 'help':
          commandHelp(message);
          break;
        case 'firstrule':
          commandFirstRule(message);
          break;
        case 'stats':
          await commandviletaintifyCount(message);
          break;
        case 'whitelist':
          await commandServerWhitelist(message);
          break;
        case 'access':
          await commandServerAccess(message);
          break;
        case 'setting':
          await commandServerSetting(message, command[1], command[2]);
          break;
        default:
          commandUnknown(message);
      }
    } catch (error) {
      logger.info(`Command error occured: ${error.message}`, {
        command,
        error,
      });
    }
  };

  public async handleviletaintChance(message: Discord.Message): Promise<void> {
    logger.debug('Handling viletaint chance');
    try {
      const server = await servers.getServer(message.guild.id);

      const whitelist = await server.getWhitelist();
      const config = await server.getSettings();
      logger.debug('Server config', { config });

      logger.debug(`Server lock is ${server.lock}`);

      // Temporary helper to convert servers that may have set strings as their viletaintBuffer setting
      if (typeof server.lock === 'string') {
        logger.debug(
          `Server [${server.id}] has a string for viletaintBuffer... converting!`
        );
        let newLock = parseInt(server.lock);

        if (isNaN(newLock)) {
          logger.debug(
            `Server [${server.id}] had an invalid string (not a number). Resetting to default buffer`
          );
          server.setSetting('viletaintBuffer', baseConfig.viletaintBuffer);
          newLock = baseConfig.viletaintBuffer;
        } else {
          server.setSetting('viletaintBuffer', newLock);
        }
        server.lock = newLock;
      }

      // This is a small in-memory lock to prevent the bot from spamming back to back messages
      // on a single server due to strange luck.
      // Because the chance is calculated AFTER the lock is reset, there is only a roll for a
      // viletaintification chance every X number of messages
      if (server.lock > 0) {
        server.lock -= 1;
      }

      const messageChannel = message.channel as TextChannel;

      // Do the thing to handle the viletaint chance here
      if (
        (this.client.user.id !== message.author.id ||
          !message.author.bot ||
          config.breakTheFirstRuleOfviletaintbotics) &&
        whitelist.includes(messageChannel.name) &&
        server.lock === 0 &&
        Math.random() <= config.chanceToviletaint
      ) {
        const availableWords = message.content.trim().split(' ');
        const wordsviletaintifiable = availableWords.filter((w) => shouldWeviletaint(w));
        const wordsWithScores = await wordsDb.getWords(wordsviletaintifiable);
        const { result, words } = await viletaintify(
          message.content,
          wordsWithScores
        );
        const viletaintMessage = (await message.channel.send(
          result
        )) as Discord.Message;
        logger.debug('Send viletaintified message to channel', { result });

        // Our dumb viletaintAI code
        if (config.viletaintAI === 1) {
          logger.debug('viletaintAI is enabled. Adding and collecting reactions...');
          const emojiFilter = (reaction: MessageReaction): boolean =>
            reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
          const collector = viletaintMessage.createReactionCollector(emojiFilter, {
            time: 1000 * 60 * 10,
          });
          await viletaintMessage.react('👍');
          await viletaintMessage.react('👎');
          logger.debug('Bot reactions added');
          collector.on('end', async (collected) => {
            try {
              const upviletaints = (collected.get('👍')?.count ?? 0) - 1;
              const downviletaints = (collected.get('👎')?.count ?? 0) - 1;
              const score = upviletaints - downviletaints;
              logger.debug('Collecting reactions and getting score', { score });

              if (score) {
                words.forEach(async (word) => {
                  wordsDb.updateScore(word, score);
                });
                // When the time runs out, we will clear reactions and
                // react with the winning vote and a lock
                await viletaintMessage.react('🔒');
                if (upviletaints >= downviletaints) {
                  await viletaintMessage.react('🎉');
                } else {
                  await viletaintMessage.react('😭');
                }
                logger.debug('Recorded score for words', { score, words });
              } else {
                logger.debug('Score 0. No changes recorded for words', {
                  words,
                });
              }
            } catch (error) {
              logger.error('Something went wrong collecting reaction', error);
            }
          });
        }

        server.lock = config.viletaintBuffer;
        server.trackviletaintification();
      }
    } catch (error) {
      logger.debug('Something went wrong handling viletaint chance', error);
    }
  }
}

export default BotController;
