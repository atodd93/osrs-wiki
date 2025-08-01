import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { Message, User } from 'discord.js';

// These two lines define __dirname in an ESM-safe way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Now use __dirname as normal
const dataPath = path.resolve(__dirname, '../../data/roasts.json');

let roasts: string[] = [];
// Load roasts from JSON once at startup
try {
  const dataPath = path.resolve(__dirname, '../../data/roasts.json');
  const file = fs.readFileSync(dataPath, 'utf-8');
  roasts = JSON.parse(file);
  console.log("Resolved roast path:", dataPath);
  console.log(`Loaded ${roasts.length} roasts.`);
} catch (err) {
  console.error('Failed to load roasts.json:', err);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const handleRoastCommand = async (message: Message) => {
  if (roasts.length === 0) {
    return message.reply("I'm fresh out of insults... for now.");
  }

  // Pick a target: either the mentioned user, or the sender
  const target: User = message.mentions.users.first() || message.author;

  const roast = pickRandom(roasts).replace('{target}', target.username);
  const reply = `<@${target.id}> ${roast}`;

  await message.reply(reply);
};
