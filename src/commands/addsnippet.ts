import { createSimpleEmbed, defineCommand } from '../utils';

export default defineCommand(
  ['addsnippet', '+snippet', '+s'],
  {
    description: 'Create a new snippet.',
    usage: ['<name> <...content>'],
  },
  async ({ prisma, client, message, args: [name, ...content] }) => {
    if (!name?.length) {
      await message.reply({
        embeds: [
          createSimpleEmbed('A snippet must have a name.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }
    if (!content.length) {
      await message.reply({
        embeds: [
          createSimpleEmbed('A snippet must have content.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const existingSnippet = client.snippets.find((snippet) => snippet.name === name);
    if (existingSnippet) {
      await message.reply({
        embeds: [
          createSimpleEmbed('A snippet with that name already exists.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const snippet = await prisma.snippet.create({
      data: {
        name,
        content: content.join(' '),
      },
    });
    client.snippets.set(snippet.id, snippet);
    await message.reply({
      embeds: [
        createSimpleEmbed(`Snippet "${name}" has successfully been created.`, {
          type: 'success',
        }),
      ],
    });
  },
);
