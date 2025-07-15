import { Message, User } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let compliments: string[] = [];

// Load compliments from JSON
try {
  const complimentsPath = path.resolve(__dirname, '../../data/bhand_compliments.json');
  const file = fs.readFileSync(complimentsPath, 'utf-8');
  compliments = JSON.parse(file);
  console.log(`✅ Loaded ${compliments.length} compliments.`);
} catch (err) {
  console.error('❌ Failed to load bhand_compliments.json:', err);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const handleComplimentCommand = async (message: Message) => {
  if (compliments.length === 0) {
    return message.reply("I'm out of compliments for now 😢");
  }

  const target: User = message.mentions.users.first() || message.author;
  const compliment = pickRandom(compliments);

  await message.reply(compliment);
};
