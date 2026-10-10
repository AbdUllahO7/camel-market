import * as signalR from '@microsoft/signalr';
import type { AuctionHubStatus } from '../types';

export interface BidUpdatePayload {
  auctionId: number | string;
  currentPrice: number;
  userId?: string;
  userName?: string;
  amount: number;
  createdAt?: string;
}

export interface AuctionEndedPayload {
  auctionId: number | string;
  winner?: string;
  amount?: number;
}

export interface AuctionStoppedPayload {
  auctionId: number | string;
}

class AuctionHubService {
  private connection: signalR.HubConnection | null = null;
  private currentJoinedAuctionId: number | string | null = null;
  private statusListeners: Set<(status: AuctionHubStatus) => void> = new Set();
  private bidListeners: Set<(data: BidUpdatePayload) => void> = new Set();
  private endedListeners: Set<(data: AuctionEndedPayload) => void> = new Set();
  private stoppedListeners: Set<(data: AuctionStoppedPayload) => void> = new Set();

  public getStatus(): AuctionHubStatus {
    if (!this.connection) return 'initial';
    switch (this.connection.state) {
      case signalR.HubConnectionState.Connected:
        return 'connected';
      case signalR.HubConnectionState.Connecting:
      case signalR.HubConnectionState.Reconnecting:
        return 'connecting';
      case signalR.HubConnectionState.Disconnected:
      default:
        return 'failure';
    }
  }

  private notifyStatus(status: AuctionHubStatus) {
    this.statusListeners.forEach((listener) => listener(status));
  }

  public subscribeStatus(listener: (status: AuctionHubStatus) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.getStatus());
    return () => this.statusListeners.delete(listener);
  }

  public subscribeBidUpdate(listener: (data: BidUpdatePayload) => void): () => void {
    this.bidListeners.add(listener);
    return () => this.bidListeners.delete(listener);
  }

  public subscribeAuctionEnded(listener: (data: AuctionEndedPayload) => void): () => void {
    this.endedListeners.add(listener);
    return () => this.endedListeners.delete(listener);
  }

  public subscribeAuctionStopped(listener: (data: AuctionStoppedPayload) => void): () => void {
    this.stoppedListeners.add(listener);
    return () => this.stoppedListeners.delete(listener);
  }

  private getCleanToken(): string {
    if (typeof window === 'undefined') return '';
    const token = localStorage.getItem('auth_token');
    if (!token) return '';
    return token.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
  }

  private setupEventHandlers(conn: signalR.HubConnection) {
    conn.on('ReceiveBidUpdate', (data: any) => {
      const extractedName =
        data.userName ||
        data.user_Name ||
        data.customerName ||
        data.customer_Name ||
        data.fullName ||
        data.full_Name ||
        data.bidderName ||
        data.bidder_Name ||
        data.user?.fullName ||
        data.user?.name ||
        data.customer?.fullName ||
        data.customer?.name ||
        data.name;

      const payload: BidUpdatePayload = {
        auctionId: data.auctionId ?? data.auction_Id ?? data.id,
        currentPrice: Number(data.currentPrice ?? data.amount ?? data.price ?? 0),
        userId: data.userId ?? data.user_Id ?? data.customerId ?? data.customer_Id,
        userName: extractedName,
        amount: Number(data.amount ?? data.currentPrice ?? data.price ?? 0),
        createdAt: data.createdAt || data.created_At || new Date().toISOString(),
      };
      this.bidListeners.forEach((cb) => cb(payload));
    });

    conn.on('AuctionEnded', (data: any) => {
      const winnerName =
        data.winner ||
        data.userName ||
        data.user_Name ||
        data.fullName ||
        data.customerName ||
        data.bidderName ||
        data.user?.fullName;

      const payload: AuctionEndedPayload = {
        auctionId: data.auctionId ?? data.auction_Id ?? data.id,
        winner: winnerName,
        amount: Number(data.amount ?? data.currentPrice ?? 0),
      };
      this.endedListeners.forEach((cb) => cb(payload));
    });

    conn.on('AuctionStopped', (data: any) => {
      const payload: AuctionStoppedPayload = {
        auctionId: data.auctionId ?? data.auction_Id ?? data.id,
      };
      this.stoppedListeners.forEach((cb) => cb(payload));
    });

    conn.onreconnecting(() => {
      this.notifyStatus('connecting');
    });

    conn.onreconnected(() => {
      this.notifyStatus('connected');
      if (this.currentJoinedAuctionId) {
        this.joinAuction(this.currentJoinedAuctionId);
      }
    });

    conn.onclose(() => {
      this.notifyStatus('failure');
    });
  }

  public async connect(): Promise<boolean> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return true;
    }

    if (this.connection && this.connection.state === signalR.HubConnectionState.Connecting) {
      return true;
    }

    this.notifyStatus('connecting');

    // المحاولة 1: الاتصال المباشر عبر WebSockets مع تخطي التفاوض لتفادي قيود CORS
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://api.camel.market/auctionHub', {
          accessTokenFactory: () => this.getCleanToken(),
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < 3) {
              return 2000;
            }
            return null;
          },
        })
        .configureLogging(signalR.LogLevel.None)
        .build();

      this.setupEventHandlers(this.connection);
      await this.connection.start();
      this.notifyStatus('connected');
      return true;
    } catch (wsErr) {
      console.warn('Direct WebSocket connection failed, trying with negotiation fallback...', wsErr);
    }

    // المحاولة 2: الاتصال مع التفاوض التقليدي
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://api.camel.market/auctionHub', {
          accessTokenFactory: () => this.getCleanToken(),
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          skipNegotiation: false,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.None)
        .build();

      this.setupEventHandlers(this.connection);
      await this.connection.start();
      this.notifyStatus('connected');
      return true;
    } catch (err) {
      console.warn('SignalR Hub Connection error (Server might be unreachable or CORS restricted):', err);
      this.notifyStatus('failure');
      return false;
    }
  }

  public async joinAuction(auctionId: number | string): Promise<boolean> {
    const isConnected = await this.connect();
    if (!isConnected || !this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      this.notifyStatus('failure');
      return false;
    }

    try {
      this.currentJoinedAuctionId = auctionId;
      await this.connection.invoke('JoinAuctionGroup', Number(auctionId));
      return true;
    } catch (err) {
      console.warn('Error invoking JoinAuctionGroup:', err);
      return false;
    }
  }

  public async leaveAuction(auctionId: number | string): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('LeaveAuctionGroup', Number(auctionId));
      } catch (err) {
        console.warn('Error invoking LeaveAuctionGroup:', err);
      }
    }
    if (this.currentJoinedAuctionId === auctionId) {
      this.currentJoinedAuctionId = null;
    }
  }
}

export const auctionHubService = new AuctionHubService();
