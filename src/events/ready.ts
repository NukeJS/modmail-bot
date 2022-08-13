import type { ModmailClient } from '../bot';

const onReady = (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }
};

export default onReady;
