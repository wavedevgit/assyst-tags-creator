type FetchResult = {
    /**
     * Returns text content of response
     */
    text(): string;
    /**
     * Returns json parsed content of response
     * Throws if fails to parse
     * */
    json<T>(): T;
    headers: FetchHeaders;
    _buffer: ArrayBuffer;
    arrayBuffer(): ArrayBuffer;
};

type KnownHeaders =
    | 'accept'
    | 'accept-charset'
    | 'accept-encoding'
    | 'accept-language'
    | 'authorization'
    | 'cache-control'
    | 'connection'
    | 'content-length'
    | 'content-type'
    | 'cookie'
    | 'date'
    | 'etag'
    | 'expect'
    | 'expires'
    | 'from'
    | 'host'
    | 'if-match'
    | 'if-modified-since'
    | 'if-none-match'
    | 'if-range'
    | 'if-unmodified-since'
    | 'last-modified'
    | 'origin'
    | 'pragma'
    | 'referer'
    | 'set-cookie'
    | 'user-agent'
    | 'vary'
    | 'via'
    | 'warning'
    | 'x-forwarded-for'
    | 'x-forwarded-host'
    | 'x-forwarded-proto'
    | 'x-requested-with';

/**
 * All requests have these:
 * User agent is "Assyst Eval" (you cannot change it.)
 * IP is 128.140.104.33
 */
type FetchHeaders = Partial<Record<KnownHeaders, string>> &
    Record<string, string>;

type FetchMethod =
    | 'delete'
    | 'get'
    | 'head'
    | 'options'
    | 'patch'
    | 'post'
    | 'put'
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PUT';

type FetchOptions = {
    method?: FetchMethod;
    body: unknown;
    // headers?: FetchHeaders (currently you cannot change headers at all);
};

/**
 * Make http calls using fetch
 * @limit 5 request per session/tag execution
 */
export type Fetch = (url: string, options: FetchOptions) => FetchResult;
export type { FetchHeaders, FetchMethod, FetchResult, FetchOptions };
