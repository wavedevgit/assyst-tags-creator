/**
 * Assyst exposes a fake client, so this really doesnt matter
 * This is just included and might be never used
 */
type DiscordClient = {
    _events: Record<string, unknown>;
    _eventsCount: number;
    _maxListeners: number;
    _isBot: boolean;
    _killed: boolean;
    application: Record<string, unknown>;
    cluster: Record<string, unknown>;
    commandClient: Record<string, unknown>;
    imageFormat: string;
    token: string;
    ran: boolean;
    owners: string;
    applications: string;
    channels: string;
    connectedAccounts: string;
    emojis: string;
    guilds: string;
    members: string;
    messages: string;
    notes: string;
    presences: string;
    relationships: string;
    roles: string;
    sessions: string;
    typings: string;
    users: string;
    voiceCalls: string;
    voiceConnections: string;
    voiceStates: string;
    [key: string]: unknown;
};

export type { DiscordClient };
