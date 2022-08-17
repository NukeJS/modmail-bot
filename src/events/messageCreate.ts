import { ChannelType, DMChannel, Message, TextChannel } from 'discord.js';
import type { ModmailClient } from '../bot';
import { prisma } from '../db';
import { formatTicketMessage } from '../utils';

const onMessageCreate = async (client: ModmailClient, message: Message) => {
  if (message.author.bot || message.guildId === process.env.MAIN_SERVER_ID) return;

  /**
   * Handle DM Message
   * - Check if user is blocked. If so, do nothing
   * - Create a new ticket channel if a ticket with the userId doesn't exist
   * - Create a new ticket to store in the database
   * - Send the welcome message to the user
   */
  if (message.channel instanceof DMChannel) {
    const blockedUser = client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === message.author.id,
    );
    if (blockedUser) return;

    let ticket = client.tickets.find((_ticket) => _ticket.userId === message.author.id);
    if (!ticket) {
      const createdTicketChannel = await client.inboxGuild.channels.create({
        name: `ticket-${message.author.id}`,
        type: ChannelType.GuildText,
        topic: `Ticket channel for user: "${message.author.tag}", ID: "${message.author.id}".`,
        reason: `Created ticket channel for user: "${message.author.tag}".`,
      });
      ticket = await prisma.ticket.create({
        data: {
          userId: message.author.id,
          channelId: createdTicketChannel.id,
        },
      });
      client.tickets.set(ticket.id, ticket);
      if (process.env.RESPONSE_MESSAGE) await message.channel.send(process.env.RESPONSE_MESSAGE);
    }

    /**
     * Send the message from the user in the inbox ticket channel
     * TODO: Handle attachments?
     */
    const ticketChannel = await client.inboxGuild.channels.fetch(ticket.channelId);
    if (ticketChannel instanceof TextChannel) {
      if (message.content.length) {
        await ticketChannel.send(formatTicketMessage(message));
      }
      if (message.attachments.size) {
        await ticketChannel.send({ files: [...message.attachments.values()] });
      }
    }

    return;
  }

  /**
   * Handle message sent in the inbox guild
   * - Check if channel is a ticket
   * - If ticket channel, send message only if it doesn't start with the prefix
   * - Else, run command
   */
  if (message.guildId === process.env.INBOX_SERVER_ID) {
    const ticket = client.tickets.find((_ticket) => _ticket.channelId === message.channelId);

    if (ticket) {
      if (!message.content.startsWith(process.env.PREFIX!)) {
        const user = client.users.cache.get(ticket.userId);
        if (!user) return;

        if (message.content.length) {
          await user.send(message.content);
        }
        if (message.attachments.size) {
          await user.send({ files: [...message.attachments.values()] });
        }
        return;
      }
    }

    const [cmd, ...args] = message.content.trim().slice(process.env.PREFIX?.length).split(/ +/g);

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.get(client.aliases.get(cmd.toLowerCase())!);
    if (!command || command.disabled) return;

    // TODO: Check if channel is a ticket
    if (command.permissions?.ticketChannelOnly && !ticket) {
      await message.reply('This command only works inside of a ticket channel.');
      return;
    }

    try {
      await command.run({ client, message, args, ticket });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      await message.channel.send('An error occurred while trying to run the command.');
    }
  }
};

export default onMessageCreate;
