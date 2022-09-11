import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed } from '../utils';

export const meta: CommandMeta = {
  name: 'snippets',
  description: 'Lists all available snippets.',
};

export const run: CommandRunFunction = async ({ client, message }) => {
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
};
