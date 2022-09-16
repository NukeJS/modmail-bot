import type { Message, MessageOptions, MessagePayload, User } from 'discord.js';
import { createErrorEmbed } from '.';

export const sendDirectMessage = async (
  message: Message,
  user: User | null | undefined,
  messageToSend: string | MessagePayload | MessageOptions,
) => {
  try {
    await user?.send(messageToSend);
  } catch (error) {
    await message.reply({
      embeds: [
        createErrorEmbed().setDescription(
          `Unable to send a DM to this user.
          They could have blocked me, or have their DMs are turned off.`,
        ),
      ],
    });
  }
};
