import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { handleRoastCommand } from './commands/roast.js';
import { handleComplimentCommand } from './commands/compliments.js';
import fs from 'fs';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const [command, ...args] = message.content.trim().split(/\s+/);

  switch(command) {
    case '!search':
      if (args.length === 0) {
        return message.reply('Please provide a search term, e.g. `!search lunar staff`');
      }

      const searchTerm = args.join(' '); // ✅ full query string
      const statusMsg = await message.channel.send(`Searching for: **${searchTerm}**`);

      // Optional: encode for a URL (e.g. for web scraping or API)
      const encoded = encodeURIComponent(searchTerm);
      var url = `https://oldschool.runescape.wiki/w/Special:Search?search=${encoded}`;

      try {
        const res = await fetch(url);
        const html = await res.text();
        statusMsg.delete();
        const isDisambiguation = /"[^"]+"\s+may\s+refer\s+to/i.test(html);

        if (isDisambiguation) {
          message.channel.send(`${url}`);
        } else {
          message.channel.send(`Search results for **${searchTerm}**: <${url}>`);
        }

      } catch (err) {
        console.error(err);
        message.reply('Something went wrong trying to search.');
      }
      break;
    case '!gay':
      if (args.length > 0) {
        await message.channel.send(`${args[0]} is ${Math.floor(Math.random() * 100)}% gay`);
      } else {
        await message.reply(`You are ${Math.floor(Math.random() * 100)}% gay`)
      }
      
      break;
    case '!poke':
      if (args.length === 0) {
        return message.reply('Please provide a user to poke, e.g. `!poke @user`');
      }

      const userToPoke = message.mentions.users.first();
      if (!userToPoke) {
        return message.reply('User not found. Please mention a valid user.');
      }

      await message.channel.send(`${userToPoke} has been poked, god almighty that's a stinky fart!`);
      break;
    case '!beer':
      if (args.length === 0) {
        return message.reply('Please provide a beer to search for, e.g. Guinness');
      }
      url = `https://www.beeradvocate.com/search?q=${encodeURIComponent(args.join(' '))}`;
      await message.reply(`${url}`);
      break;
    case '!roast':
      await handleRoastCommand(message);
      break;
    case '!compliment':
      await handleComplimentCommand(message);
      break;
    case '!dink':
      await message.reply(`Dink is a plugin you can get on RuneLite that uses a webhook. Please use the supplied webhook and you can use Dink on this server too: <awaiting per-server webhook implementation>`)
      break;
    default:
      if (client.user && message.mentions.has(client.user)) {
        const jerkResponses = JSON.parse(fs.readFileSync('data/ping_responses.json', 'utf-8'));
        const response = jerkResponses[Math.floor(Math.random() * jerkResponses.length)];
        await message.reply(response);
      } else if (/gnome child/i.test(message.content)) {
        await message.reply('What you mean is "gnome child"');
      }

      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
