import express, { Express, Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { resolve } from 'path';
import { Logger } from './utils';

const DEFAULT_PORT: number = 3000;
const DEFAULT_CLIENT_PATH: string = '../client/dist';

const DEFAULT_PARAMS = {
    port: DEFAULT_PORT,
    clientPath: DEFAULT_CLIENT_PATH,
}

const log = new Logger('server');

export default class Server {
    port: number;
    clientPath: string;

    app: Express;
    server: HttpServer;
    io: WebSocketServer;

    constructor(params: any = DEFAULT_PARAMS) {
        log.info('initializing...');
        log.debug('params:', params);

        this.port = params.port ?? 3000;
        this.clientPath = resolve(params.client ?? DEFAULT_CLIENT_PATH);

        this.app = express();

        this.app.use((req: Request, res: Response, next: Function) => {
            log.debug(req.method, req.path);
            next();
        });

        this.app.use('/', express.static(this.clientPath));

        this.server = createServer(this.app);
        this.server.on('listening', () => log.info('listening on port', this.port));

        this.io = new WebSocketServer({ server: this.server });
        this.io.on('connection', this.onConnection.bind(this));

        this.server.listen(this.port);
    }

    onConnection(socket: WebSocket, request: Request) {
        const ip: string = request.socket.remoteAddress ?? 'unknown';
        
        socket.on('disconnected', (info: any) => log.debug(`(${ip}) disconnected:`, info));
        socket.on('error', (err: Error) => log.error(`(${ip}):`, err));
        socket.on('warning', (wrn: string) => log.warn(`(${ip}):`, wrn));
    }
}