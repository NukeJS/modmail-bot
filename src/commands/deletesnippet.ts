import { defineEmbed, defineCommand } from '../utils';

export default defineCommand(
  ['deletesnippet', '-snippet', '-s'],
  { description: 'Delete a snippet.', usage: ['<name>'] /* examples: ['test'] */ },
  async ({ prisma, client, message, args: [name] }) => {
    if (!name?.length) {
      await message.reply({
        embeds: [
          defineEmbed('A name must be provided.', {
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
          defineEmbed("A snippet with that name doesn't exist.", {
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
        defineEmbed(`Snippet \`${name}\` has successfully been deleted.`, {
          type: 'success',
        }),
      ],
    });
  },
);
