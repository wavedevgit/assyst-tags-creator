import { PrimaryGuild } from './guilds';

export interface User {
    id: string;
    username: string;
    discriminator: string;
    global_name: string | null;

    avatar: string | null;
    banner: string | null;
    accent_color: number | null;

    bot: boolean;
    public_flags: number;

    avatar_decoration: string | null;
    avatar_decoration_data?: AvatarDecorationData | null;

    primary_guild?: PrimaryGuild;
}

export interface AvatarDecorationData {
    sku_id: string;
    asset: string;
}
