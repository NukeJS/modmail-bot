import type { Command } from '../types/command';

const reply: Command = {
  name: 'reply',
  permissions: {
    ticketOnly: true,
  },
  run: ({ client }) => {
    console.log(client);
  },
};

export default reply;
