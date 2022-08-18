# modmail-bot

A Discord modmail bot made with Discord.js

## Todos

- [ ] Assign unarchived tickets to a category
- [ ] Assign archived tickets to a category

## Installation

Make sure to install the dependencies:

```sh
# yarn
yarn install

# npm
npm install
```

## Environment Variables

Copy the `.env.example` file into `.env`:

```sh
cp .env.example .env
```

Update the values accordingly.

## Development

Migrating the database:

```sh
npx prisma migrate dev
```

Need to reset the database?:

```sh
npx prisma migrate reset
```

Start the bot:

```sh
# yarn
yarn dev

# npm
npm run dev
```

## Production

Migrating the database:

```sh
npx prisma migrate deploy
```

Build the bot for production:

```sh
# yarn
yarn build

# npm
npm run build
```

Start the bot:

```sh
# yarn
yarn start

# npm
npm run start
```

---

© 2022 - NukeJS | MIT License
