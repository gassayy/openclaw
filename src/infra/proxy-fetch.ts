/**
 * Proxy-aware fetch for HTTP/HTTPS requests.
 * Used by channels (e.g. Telegram) and by the embedded agent runner for provider API calls.
 */
import { ProxyAgent, fetch as undiciFetch } from "undici";
import { wrapFetchWithAbortSignal } from "./fetch.js";

export function makeProxyFetch(proxyUrl: string): typeof fetch {
  const agent = new ProxyAgent(proxyUrl);
  const fetchImpl = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const base = init ? { ...init } : {};
    // undici types (Request/Response/RequestInit) differ slightly from DOM; cast to satisfy type checker.
    const initWithDispatcher = { ...base, dispatcher: agent } as RequestInit & {
      dispatcher: ProxyAgent;
    };
    return undiciFetch(
      input as Parameters<typeof undiciFetch>[0],
      initWithDispatcher as Parameters<typeof undiciFetch>[1],
    ) as unknown as Promise<Response>;
  };
  return wrapFetchWithAbortSignal(fetchImpl);
}
