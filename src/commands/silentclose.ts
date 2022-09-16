import { defineEmbed, defineCommand } from '../utils';

export default defineCommand(
  ['silentclose', 'sc'],
  {
    description: `Silently close the ticket where the command is used.
      This means the user won't receive a message about the ticket being closed.`,
    usage: [''],
    permissions: {
      ticketOnly: true,
      archivedTicketAllowed: true,
    },
  },
  async ({ message, ticket }) => {
    if (!ticket) return;

    await message.reply({
      embeds: [
        defineEmbed('Closing ticket...', {
          type: 'info',
        }),
      ],
    });
    await message.channel.delete();
  },
);
