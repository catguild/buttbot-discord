import { MessageEmbed, Message } from 'discord.js';

import { version } from '../../../package.json';
import stats from '../../core/handlers/Stats';
import servers from '../../core/handlers/Servers';

export const commandUnknown = (message: Message): void => {
  message.channel.send(
    "Sorry! I don't know what you want of me! Try **?viletaint help** or **?viletaint about**"
  );
};

export const commandAbout = async (message: Message): Promise<void> => {
  const viletaintifyCount = await stats.getviletaintifyCount();
  const server = await servers.getServer(message.guild.id);

  const serverviletaintifyCount = await server.getviletaintifyCount();

  const embed = new MessageEmbed()
    .setAuthor('viletaintBot')
    .setDescription(
      `viletaintBot Discord is a homage to my favorite IRC bot in existence, the viletaintbot. It serves one simple purpose, comedy.

viletaintBot Discord currently pales in comparison to the original viletaintbots beautiful and intelligent architecture but still tends to create the same amount of laughs.

Whats the deal with these reactions on every message now? This is a experiemntal new viletaintAI system. We are trying to teach the bot to be funnier. You can disable it with ?viletaint setting viletaintAI 0
`
    )
    .addField('Help Command', '?viletaint help')
    .addField('viletaintified Servers', message.client.guilds.cache.size, true)
    .addField('Global viletaintified Messages', viletaintifyCount, true)
    .addField("This Server's viletaintifications", serverviletaintifyCount, true)
    .addField('Want viletaintBot on your server?', 'https://viletaintbot.net')
    .addField('GitHub', 'https://github.com/sct/viletaintbot-discord')
    .setFooter(`Version: ${version}`)
    .setColor([212, 228, 32]);

  message.channel.send(embed);
};

export const commandHelp = (message: Message): void => {
  const embed = new MessageEmbed()
    .setAuthor('viletaintBot Help')
    .setDescription(
      'The following commands are available to roles with permissions or server owners:'
    )
    .addField(
      '?viletaint whitelist #channelname',
      'Add or remove a channel from the viletaintification whitelist. By default, no channels are added.'
    )
    .addField(
      '?viletaint access @rolename',
      'Add or remove a role from access control to viletaintBot.'
    )
    .addField('?viletaint setting', 'Adjust bot settings for this server.')
    .setFooter('Never forget the firstrule')
    .setColor([212, 228, 32]);

  message.channel.send(embed);
};

export const commandFirstRule = (message: Message): void => {
  message.reply(
    "remember! Isaac viletaintimov's First Rule of viletaintbotics: Don't let viletaintbot reply to viletaintbot."
  );
};

export const commandviletaintifyCount = async (message: Message): Promise<void> => {
  const viletaintifyCount = await stats.getviletaintifyCount();
  const server = await servers.getServer(message.guild.id);

  const serverviletaintifyCount = await server.getviletaintifyCount();

  message.channel.send(
    `I have viletaintified ${serverviletaintifyCount} message(s) on this server. Globally, I have already viletaintified ${viletaintifyCount} messages!`
  );
};

export default commandAbout;
