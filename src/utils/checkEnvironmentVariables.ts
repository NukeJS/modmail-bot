import { z, ZodError } from 'zod';

const getErrorMessage = (name: string) => `Missing "${name}" environment variable.`;

const EnvironmentVariablesSchema = z.object({
  DATABASE_URL: z.string().min(1, getErrorMessage('DATABASE_URL')),
  MAIN_SERVER_ID: z.string().min(1, getErrorMessage('MAIN_SERVER_ID')),
  INBOX_SERVER_ID: z.string().min(1, getErrorMessage('INBOX_SERVER_ID')),
  OPEN_TICKETS_CATEGORY_ID: z.string().min(1, getErrorMessage('OPEN_TICKETS_CATEGORY_ID')),
  ARCHIVED_TICKETS_CATEGORY_ID: z.string().min(1, getErrorMessage('ARCHIVED_TICKETS_CATEGORY_ID')),
  TOKEN: z.string().min(1, getErrorMessage('TOKEN')),
  PREFIX: z.string().min(1, getErrorMessage('PREFIX')),
  STATUS: z.string().min(1, getErrorMessage('STATUS')),
  RESPONSE_MESSAGE: z.string().min(1, getErrorMessage('RESPONSE_MESSAGE')),
});

export const checkEnvironmentVariables = () => {
  try {
    EnvironmentVariablesSchema.parse(process.env);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const errors = JSON.parse(error);
    errors.forEach((err: ZodError) => console.error(err.message));
    process.exit(1);
  }
};
