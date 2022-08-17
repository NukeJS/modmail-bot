import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const snippetCommand: Command = {
  name: 'snippet',
  aliases: ['s'],
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, args: [name], ticket }) => {
    if (!ticket) return;
    if (!name?.length) {
      await message.reply({
        embeds: [
          createSimpleEmbed('A name must be provided.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const snippet = client.snippets.find((_snippet) => _snippet.name === name);
    if (!snippet) {
      await message.reply({
        embeds: [
          createSimpleEmbed("A snippet with that name doesn't exist.", {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await Promise.all([user.send(snippet.content), message.channel.send(snippet.content)]);
  },
};

export default snippetCommand;
