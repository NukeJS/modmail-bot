import type { Message, MessageOptions, MessagePayload, User } from 'discord.js';
import { createErrorEmbed } from '.';

export const sendDirectMessage = async (
  messageByAuthor: Message,
  user: User | null | undefined,
  message: string | MessagePayload | MessageOptions,
) => {
  try {
    await user?.send(message);
  } catch (error) {
    await messageByAuthor.reply({
      embeds: [
        createErrorEmbed().setDescription(
          'Unable to send a DM to this user.\nThey could have blocked me, or have their DMs are turned off.',
        ),
      ],
    });
  }
};
