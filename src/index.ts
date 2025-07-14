import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

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
  }
});

client.login(process.env.DISCORD_TOKEN);
