import type { ModmailClient } from '../bot';

const onReady = (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }

  // TODO: Check all if all ticket channels in db still exist. if not, delete from DB
};

export default onReady;
