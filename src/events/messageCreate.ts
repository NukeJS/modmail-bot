import { ChannelType, DMChannel, Message, TextChannel } from 'discord.js';
import type { ModmailClient } from '../bot';
import { prisma } from '../db';
import { createSimpleEmbed, formatTicketMessage, sendDirectMessage } from '../utils';

const onMessageCreate = async (client: ModmailClient, message: Message) => {
  if (message.author.bot || message.guildId === process.env.MAIN_SERVER_ID) return;

  /**
   * Handle DM Message
   * - Check if user if blocked. If so, do nothing.
   * - Check if a ticket exists.
   *  - No? Create a new channel and ticket, send the default response message to the user.
   *  - Yes? Send the user's message in the corresponding ticket channel.
   */
  if (message.channel instanceof DMChannel) {
    const userIsBlocked = !!client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === message.author.id,
    );
    if (userIsBlocked) return;

    let ticket = client.tickets.find(
      (_ticket) => _ticket.userId === message.author.id && !_ticket.isArchived,
    );
    if (!ticket) {
      const newTicketChannel = await client.inboxGuild.channels.create({
        name: `ticket-${message.author.id}`,
        type: ChannelType.GuildText,
        topic: `Ticket channel for user: "${message.author.tag}", ID: "${message.author.id}".`,
        reason: `Created ticket channel for user: "${message.author.tag}".`,
        parent: process.env.OPEN_TICKETS_CATEGORY_ID,
      });
      ticket = await prisma.ticket.create({
        data: {
          userId: message.author.id,
          channelId: newTicketChannel.id,
        },
      });
      client.tickets.set(ticket.id, ticket);

      if (process.env.RESPONSE_MESSAGE) {
        await message.channel.send({
          embeds: [
            createSimpleEmbed(process.env.RESPONSE_MESSAGE, {
              type: 'info',
            }),
          ],
        });
      }
    }

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
   * - Check if the channel where the message has been sent is a ticket channel.
   *  - Yes? Send the message to the user only if it doesn't start with the prefix.
   *  - No? Run the command.
   */
  if (message.guildId === process.env.INBOX_SERVER_ID) {
    const ticket = client.tickets.find((_ticket) => _ticket.channelId === message.channelId);

    if (ticket && !ticket.isArchived) {
      if (!message.content.startsWith(process.env.PREFIX!)) {
        const user = client.users.cache.get(ticket.userId);
        if (!user) return;

        if (message.content.length) {
          await sendDirectMessage(message, user, message.content);
        }
        if (message.attachments.size) {
          await sendDirectMessage(message, user, { files: [...message.attachments.values()] });
        }
        return;
      }
    }

    const [cmd, ...args] = message.content.trim().slice(process.env.PREFIX?.length).split(/ +/g);

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.get(client.aliases.get(cmd.toLowerCase())!);
    if (!command) return;

    if (command.meta.permissions?.ticketOnly && !ticket) {
      await message.reply({
        embeds: [
          createSimpleEmbed('This command only works inside of a ticket channel.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    if (!command.meta.permissions?.archivedTicketAllowed && ticket?.isArchived) {
      await message.reply({
        embeds: [
          createSimpleEmbed("This command doesn't work in archived ticket channels.", {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    try {
      await command.run({ prisma, client, message, args, ticket });
    } catch (error) {
      console.error(error);

      await message.channel.send({
        embeds: [
          createSimpleEmbed('An error occurred while trying to run the command.', {
            type: 'danger',
          }),
        ],
      });
    }
  }
};

export default onMessageCreate;
