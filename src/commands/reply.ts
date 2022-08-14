import type { Command } from '../types/command';

const reply: Command = {
  name: 'reply',
  run: ({ client }) => {
    console.log(client);
  },
};

export default reply;
