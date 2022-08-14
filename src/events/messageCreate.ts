import { DMChannel, Message } from 'discord.js';
import type { ModmailClient } from '../bot';

const onMessageCreate = async (client: ModmailClient, message: Message) => {
  if (message.author.bot || message.guildId === process.env.MAIN_SERVER_ID) return;

  if (message.channel instanceof DMChannel) {
    // Is DM, handle this
    return;
  }

  if (message.guildId === process.env.INBOX_SERVER_ID) {
    if (!message.content.startsWith(process.env.PREFIX!)) return;

    const [cmd, ...args] = message.content.trim().slice(process.env.PREFIX?.length).split(/ +/g);

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.get(client.aliases.get(cmd.toLowerCase())!);
    if (!command || command.disabled) return;

    // TODO: Check if channel is a thread
    if (command.permissions?.threadOnly) {
      return;
    }

    try {
      await command.run({ client, message, args });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      await message.channel.send('An error occurred while trying to run the command.');
    }
  }
};

export default onMessageCreate;
