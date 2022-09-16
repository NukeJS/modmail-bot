import { defineCommand, createInfoEmbed } from '../utils';

export default defineCommand(
  'snippets',
  { description: 'Lists all available snippets.', usage: [''] },
  async ({ client, message }) => {
    await message.reply({
      embeds: [
        createInfoEmbed()
          .setTitle(`Available Snippets (${client.snippets.size})`)
          .setDescription(
            client.snippets.map((snippet) => `\`${snippet.name}\``).join(', ') ||
              'No snippets found.',
          ),
      ],
    });
  },
);
