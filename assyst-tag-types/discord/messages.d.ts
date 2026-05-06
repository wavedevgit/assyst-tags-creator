import { GuildMember } from './guilds.d.ts';
import { User } from './users.d.ts';

export interface Message {
    id: string;
    type: number;
    content: string;
    channel_id: string;
    guild_id?: string;

    author: User;
    mentions: UserMention[];
    mention_roles: string[];
    mention_everyone: boolean;

    attachments: Attachment[];
    embeds: unknown[];
    sticker_items: unknown[];

    pinned: boolean;
    tts: boolean;

    timestamp: string;
    edited_timestamp: string | null;

    call: unknown | null;
}

export interface UserMention extends User {
    member?: GuildMember;
}

export interface Attachment {
    id: string;
    filename: string;
    size: number;

    url: string;
    proxy_url: string;

    content_type?: string;

    width?: number;
    height?: number;
}
