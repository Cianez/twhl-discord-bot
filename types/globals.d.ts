import { Client, Collection } from "discord.js";
import winston from "winston";

export type botClient = Client & {
    logger: winston,
    user: any,
    silenced: boolean,
    commands: Collection,
    filters: Collection,
    events: Collection
};