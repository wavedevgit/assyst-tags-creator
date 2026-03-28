import { User } from './users';

export interface GuildMember {
    roles: string[];
    joined_at: string;
    nick: string | null;

    mute: boolean;
    deaf: boolean;

    flags: number;
    communication_disabled_until: string | null;

    user: User | null;
}

export interface PrimaryGuild {
    identity_enabled: boolean;
    identity_guild_id: string;
    tag: string;
    badge: string;
}
