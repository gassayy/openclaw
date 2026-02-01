/**
 * Gateway plugin that routes the Discord gateway WebSocket through an HTTP(S) proxy.
 * Carbon's GatewayPlugin uses raw WebSocket; this subclass passes an HttpsProxyAgent
 * so the wss:// connection is tunneled via the proxy (CONNECT).
 */
import {
  type APIGatewayBotInfo,
  GatewayPlugin,
  type GatewayPluginOptions,
} from "@buape/carbon/gateway";
import { HttpsProxyAgent } from "https-proxy-agent";
import WebSocket from "ws";

export class ProxyGatewayPlugin extends GatewayPlugin {
  private readonly proxyUrl: string;

  constructor(options: GatewayPluginOptions, gatewayInfo?: APIGatewayBotInfo, proxyUrl?: string) {
    super(options, gatewayInfo);
    if (!proxyUrl?.trim()) {
      throw new Error("ProxyGatewayPlugin requires a non-empty proxyUrl");
    }
    this.proxyUrl = proxyUrl.trim();
  }

  protected override createWebSocket(url: string): WebSocket {
    const agent = new HttpsProxyAgent(this.proxyUrl);
    return new WebSocket(url, { agent });
  }
}
