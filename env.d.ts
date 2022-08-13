declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MAIN_SERVER_ID: string;
      INBOX_SERVER_ID: string;
      TOKEN: string;
      PREFIX: string | undefined;
      STATUS: string;
      RESPONSE_MESSAGE: string;
    }
  }
}

export {};
