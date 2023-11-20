import { configDotenv } from "dotenv";

configDotenv();
export const localPagesUri = `${process.env.PAGES_HOST}:${process.env.PAGES_HOST_PORT}`;
