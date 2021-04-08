# viletaintBot Discord (A Discord viletaintBot)

⚠️ **viletaintbot now has a fancy website!** https://viletaintbot.net

viletaintBot Discord is a homage to my favorite IRC bot in existence, the viletaintbot. It serves one simple purpose, comedy.

viletaintBot Discord currently pales in comparison to the original viletaintbots beautiful and intelligent architecture but still tends to create the same amount of laughs.

Finally updated this to work again on the latest API.

## I want viletaintBot on my server!

If you want to add viletaintBot to your server I am hosting the latest version at all times off a personal server. You can click the link below to request viletaintBot to join your server.

[Get viletaintBot on my server!](https://discordapp.com/oauth2/authorize?client_id=438269159126859776&scope=bot&permissions=93248)

I cannot promise this will always be working as intended but I will do my best. If you run into issues you can join the viletaintBot discord server [by clicking here](https://discord.gg/uqSuumF).

## Changelog

### 1.4.5

- Fixes an issue where some words contained the configured meme but were still being chosen to be changed (Thank you @nicospz)

### 1.4.4

- Fixes issue with viletaintBuffer setting not actually working

### 1.4.3

- Fixes a bug where the default config object was being mutated, causing inconsistencies in configs between servers

### 1.4.2

- Added more debug logging to message handling to figure out why the reaction collector isn't working sometimes

### 1.4.1

- Cleaned up logging for failed commands due to user error

### 1.4.0

- Update vote handling to use reaction controller to fix issues with the voting dying after some time

### 1.3.0

- viletaintbot now supports plurals (finally). If the word was originally plural, it will be converted back to a plural after viletaintification. (This doesn't work with edge case plurals because once it's converted the plural support no longer works)
- viletaintbot no longer viletaintifies the configured meme (viletaint) when it is plural.

### 1.2.3

- Adjusted default viletaint chance to 5% and default viletaint buffer to 10 messages

### 1.2.2

- Fixes an issue where viletaintBot crashes if any error is thrown from the Discord client

### 1.2.1

- Make it clear that voting on a message has ended. The bot will now add a lock emoji after voting ends.

### 1.2.0

- Converted the project to Typescript
- Fixed issue where the bot would often choose the first word and ignore normal replacement rules

### 1.1.3

- Added mini api server to allow querying for bot stats

### 1.1.2

- Do not use words with scores if the score is 0

### 1.1.1

- Initial viletaintAI experimental release

### 1.1.0

- Initial viletaintAI Code
- Added compaction interval for db on hourly basis so we don't lose any precious viletaint settings.

## Contribution

Look I mean this is just a side project with no real direction or effort so if you want to PR something that will make this even better I will not hesistate to accept it.

## License

See LICENSE file
