declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MAIN_SERVER_ID: string;
      INBOX_SERVER_ID: string;
      OPEN_TICKETS_CATEGORY_ID: string;
      ARCHIVED_TICKETS_CATEGORY_ID: string;
      TOKEN: string;
      PREFIX: string;
      STATUS: string;
      RESPONSE_MESSAGE: string;
    }
  }
}

export {};
