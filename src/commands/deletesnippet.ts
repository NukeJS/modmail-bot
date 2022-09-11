import { prisma } from '../db';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed } from '../utils';

export const meta: CommandMeta = {
  name: 'deletesnippet',
  aliases: ['-snippet', '-s'],
  description: 'Delete a snippet.',
  argsRequired: true,
  usages: ['<name>'],
  examples: ['test'],
};

export const run: CommandRunFunction = async ({ client, message, args: [name] }) => {
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

  await prisma.snippet.delete({
    where: {
      id: snippet.id,
    },
  });
  client.snippets.delete(snippet.id);
  await message.reply({
    embeds: [
      createSimpleEmbed(`Snippet "${name}" has successfully been deleted.`, {
        type: 'success',
      }),
    ],
  });
};
