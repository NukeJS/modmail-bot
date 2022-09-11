import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, sendDirectMessage } from '../utils';

export const meta: CommandMeta = {
  name: 'snippet',
  aliases: ['s'],
  description: 'Sends the content of the specified snippet to the user.',
  argsRequired: true,
  usages: ['<name>'],
  examples: ['test'],
  permissions: {
    ticketChannelOnly: true,
  },
};

export const run: CommandRunFunction = async ({ client, message, args: [name], ticket }) => {
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

  await Promise.all([
    sendDirectMessage(message, user, snippet.content),
    message.channel.send(snippet.content),
  ]);
};
