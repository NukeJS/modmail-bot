import type { Command } from '../types/command';

const snippetCommand: Command = {
  name: 'snippet',
  aliases: ['s'],
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, args: [name], ticket }) => {
    if (!ticket) return;
    if (!name.length) {
      await message.reply('A name must be provided.');
      return;
    }

    const snippet = client.snippets.find((_snippet) => _snippet.name === name);
    if (!snippet) {
      await message.reply("A snippet with that name doesn't exist.");
      return;
    }

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await Promise.all([user.send(snippet.content), message.channel.send(snippet.content)]);
  },
};

export default snippetCommand;
