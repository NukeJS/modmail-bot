import { getMainGuild } from '.';

export const getUserFromMainGuild = async (userId: string) => {
  const mainGuild = await getMainGuild();
  const user = await mainGuild.members.fetch(userId);
  return user;
};
