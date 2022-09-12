/**
 * Prefix a string with the bot's prefix.
 * @param str String to be prefixed
 * @returns Prefixed string
 */
export const prefixed = (str: string | undefined) => `${process.env.PREFIX}${str}`;
