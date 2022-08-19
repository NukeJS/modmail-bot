import type { MessagePayload, MessageOptions, User, Message } from 'discord.js';
import { createSimpleEmbed } from './createSimpleEmbed';

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
        createSimpleEmbed(
          'Unable to send a DM to this user.\nThey most likely have blocked me. 😢',
          {
            type: 'danger',
          },
        ),
      ],
    });
  }
};
