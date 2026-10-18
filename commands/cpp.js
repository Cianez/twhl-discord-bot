import { Message } from 'discord.js';

export const name = 'cpp';
export const description = 'Post a list of resources for learning C++';
export const aliases = ['c++'];

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    message.channel.send(`
Making custom entities and logic for your mod usually requires programming with C++.
Here are some resources to get started:
- <https://www.learncpp.com/>
- <https://cplusplus.com/doc/tutorial/>
- <https://www.w3schools.com/cpp/default.asp>
- <https://www.learn-cpp.org/>
- <https://beginnersbook.com/2017/08/c-plus-plus-tutorial-for-beginners/>
- <https://cppreference.com/> (advanced - more technical)
If this is not for you, try one of the following alternative SDKs:
- Half-Life Featureful: <https://github.com/FreeSlave/halflife-featureful/releases>
- Spirit of Half-Life (updated version): <https://github.com/LogicAndTrick/halflife-updated/releases>
    `.trim());
}