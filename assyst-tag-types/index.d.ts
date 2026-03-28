// types for assyst context

import { DiscordClient, Message } from './discord';
import { Fetch } from './fetch';

declare global {
    /**
     * Current message that triggered this tag
     */
    const message: Message;
    /**
     * List of arguments after tag name
     * Splitted by a space
     */
    const args: string[];
    /**
     * This variable is shared between guilds, you can only add/modify/delete to it
     * you cant remove it/change its type
     * Its always an objecte
     */
    const ctx: Record<any, any>;
    const client: DiscordClient;

    // assyst has a custom fetch
    const fetch: Fetch;
    const ImageScript: typeof import('./ImageScript');
}

export {};
