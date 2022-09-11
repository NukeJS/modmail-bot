import { prisma } from '../db';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed } from '../utils';

export const meta: CommandMeta = {
  name: 'updatesnippet',
  aliases: ['*snippet', '*s'],
  description: 'Update a existing snippet.',
  argsRequired: true,
  usages: ['<name> <...content>'],
  examples: ['test This is an updated test snippet.'],
};

export const run: CommandRunFunction = async ({ client, message, args: [name, ...content] }) => {
  if (!name?.length) {
    await message.reply({
      embeds: [
        createSimpleEmbed('You must provide the name of the snippet you wish to update.', {
          type: 'danger',
        }),
      ],
    });
    return;
  }
  if (!content.length) {
    await message.reply({
      embeds: [
        createSimpleEmbed('You must provide content to update the snippet with.', {
          type: 'danger',
        }),
      ],
    });
    return;
  }

  const existingSnippet = client.snippets.find((_snippet) => _snippet.name === name);
  if (!existingSnippet) {
    await message.reply({
      embeds: [
        createSimpleEmbed("A snippet with that name doesn't exists.", {
          type: 'danger',
        }),
      ],
    });
    return;
  }

  await prisma.snippet.updateMany({
    where: {
      name,
    },
    data: {
      name,
      content: content.join(' '),
    },
  });

  const snippet = await prisma.snippet.findFirst({
    where: {
      name,
    },
  });
  client.snippets.set(snippet!.id, snippet!);
  await message.reply({
    embeds: [
      createSimpleEmbed(`Snippet "${name}" has successfully been updated.`, {
        type: 'success',
      }),
    ],
  });
};
