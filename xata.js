import { XataClient } from '@xata.io/client';

const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
  branch: process.env.XATA_BRANCH
});

export default xata;
