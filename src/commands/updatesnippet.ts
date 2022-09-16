import { defineEmbed, defineCommand } from '../utils';

export default defineCommand(
  ['updatesnippet', '*snippet', '*s'],
  {
    description: 'Update a existing snippet.',
    usage: ['<name> <...content>'],
    // examples: ['test This is an updated test snippet.'],
  },
  async ({ prisma, client, message, args: [name, ...content] }) => {
    if (!name?.length) {
      await message.reply({
        embeds: [
          defineEmbed('You must provide the name of the snippet you wish to update.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }
    if (!content.length) {
      await message.reply({
        embeds: [
          defineEmbed('You must provide content to update the snippet with.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const existingSnippet = client.snippets.find((snippet) => snippet.name === name);
    if (!existingSnippet) {
      await message.reply({
        embeds: [
          defineEmbed("A snippet with that name doesn't exists.", {
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
        defineEmbed(`Snippet \`${name}\` has successfully been updated.`, {
          type: 'success',
        }),
      ],
    });
  },
);
