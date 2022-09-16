import { defineEmbed, defineCommand } from '../utils';

export default defineCommand(
  'snippets',
  { description: 'Lists all available snippets.', usage: [''] },
  async ({ client, message }) => {
    await message.reply({
      embeds: [
        defineEmbed(
          client.snippets.map((snippet) => `\`${snippet.name}\``).join(', ') ||
            'No snippets found.',
          {
            title: `Available Snippets (${client.snippets.size})`,
            type: 'info',
          },
        ),
      ],
    });
  },
);
