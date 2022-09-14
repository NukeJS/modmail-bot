import { createSimpleEmbed, defineCommand } from '../utils';

export default defineCommand(
  'snippets',
  { description: 'Lists all available snippets.', usage: [''] },
  async ({ client, message }) => {
    await message.reply({
      embeds: [
        createSimpleEmbed(
          client.snippets.map((_snippet) => `\`${_snippet.name}\``).join(', ') ||
            'No snippets found.',
          {
            title: 'Available Snippets',
            type: 'info',
          },
        ),
      ],
    });
  },
);
