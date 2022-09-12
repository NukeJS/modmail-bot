import type { APIEmbed } from 'discord.js';
import { Colors } from '../constants';

export type SimpleEmbedType = 'success' | 'danger' | 'warning' | 'info';

export interface SimpleEmbedOptions {
  title?: APIEmbed['title'];
  footer?: APIEmbed['footer'];
  type: SimpleEmbedType;
}

const typeToColor: Record<SimpleEmbedType, number> = {
  success: Colors.SUCCESS,
  danger: Colors.DANGER,
  warning: Colors.WARNING,
  info: Colors.INFO,
};

export const createSimpleEmbed = (
  description: string,
  { title, footer, type }: SimpleEmbedOptions,
) =>
  <APIEmbed>{
    color: typeToColor[type],
    title,
    description,
    footer,
  };
