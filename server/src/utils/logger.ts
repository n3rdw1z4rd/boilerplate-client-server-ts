import { inspect } from 'util';

const DEV = process.env.NODE_ENV?.toLowerCase() === 'development';

const COLOR_RESET = '\x1b[0m';
const COLOR_DIM = '\x1b[2m';
const COLOR_RED = '\x1b[31m';
const COLOR_GREEN = '\x1b[32m';
const COLOR_YELLOW = '\x1b[33m';
const COLOR_WHITE = '\x1b[37m';

export class Logger {
    private scope: string | null;

    constructor(scope: string | null = null) {
        this.scope = scope;
    }

    private _log(color: string, args: any[]) {
        args = args.map((arg: any) => (typeof arg === 'string') ? arg : inspect(arg));

        const scope: string = this.scope ? `[${this.scope}]` : '';

        console.log(`${color}${(new Date()).toISOString().replace(/[TZ]/g, ' ')}${scope} ${args.join(' ')} ${COLOR_RESET}`);
    };

    debug(...args: any) {
        if (DEV) this._log(COLOR_DIM + COLOR_WHITE, args);
    }

    hero(...args: any) {
        this._log(COLOR_GREEN, args)
    }

    info(...args: any) {
        this._log(COLOR_WHITE, args);
    }

    warn(...args: any) {
        this._log(COLOR_YELLOW, args);
    }

    error(...args: any) {
        this._log(COLOR_RED, args);
    }
}
