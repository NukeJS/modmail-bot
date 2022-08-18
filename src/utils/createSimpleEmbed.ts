import type { APIEmbed, APIEmbedFooter } from 'discord.js';
import { Colors } from '../constants';

export type SimpleEmbedType = 'success' | 'danger' | 'warning' | 'info';

export interface SimpleEmbedOptions {
  title?: string;
  footer?: APIEmbedFooter;
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
