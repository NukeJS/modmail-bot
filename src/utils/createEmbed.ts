import { Colors, EmbedBuilder } from 'discord.js';

export const createSuccessEmbed = () => new EmbedBuilder().setColor(Colors.Green);
export const createErrorEmbed = () => new EmbedBuilder().setColor(Colors.Red);
export const createInfoEmbed = () => new EmbedBuilder().setColor(Colors.Blue);
export const createWarningEmbed = () => new EmbedBuilder().setColor(Colors.Yellow);
