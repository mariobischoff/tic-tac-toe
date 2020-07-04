"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEvent = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
var Mark;
(function (Mark) {
    Mark["X"] = "x";
    Mark["O"] = "o";
})(Mark || (Mark = {}));
var GameEvent;
(function (GameEvent) {
    GameEvent["CONNECT"] = "connect";
    GameEvent["SEARCH_GAME"] = "searchGame ";
    GameEvent["START_GAME"] = "startGame";
    GameEvent["ON_MOVE"] = "onMove";
    GameEvent["ON_WINNER"] = "onWinner";
    GameEvent["UPDATE_BOARD"] = "updateBoard";
})(GameEvent = exports.GameEvent || (exports.GameEvent = {}));
class GameServer {
    constructor() {
        this._app = express_1.default();
        this.port = process.env.PORT || GameServer.PORT;
        this._app.use(cors_1.default());
        this.lobby = [];
        this.rooms = [];
        this.server = http_1.createServer(this._app);
        this.io = socket_io_1.default(this.server);
        this.listen();
    }
    hasWinner(board) {
        const boardDiagonal = [];
        for (const i in board) {
            // verifyLine
            if (this.hasCompleteLine(board[i])) {
                return board[i][0];
            }
            // verifyColumn
            const boardColumn = board.map(x => x[i]);
            if (this.hasCompleteLine(boardColumn)) {
                return boardColumn[0];
            }
            // diagonal
            for (const j in board[i]) {
                if (i === j) {
                    boardDiagonal.push(board[i][j]);
                }
            }
        }
        if (this.hasCompleteLine(boardDiagonal)) {
            return boardDiagonal[0];
        }
        return false;
    }
    hasCompleteLine(line) {
        let numberOfIdendicalMarks = 0;
        line.reduce((pre, cur) => {
            if (cur === pre)
                numberOfIdendicalMarks++;
            return cur;
        }, line[0]);
        return numberOfIdendicalMarks === line.length;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            const { id } = socket;
            // search for game
            socket.on('searchGame', (name) => {
                const player = { id, name };
                this.lobby.push(player);
                if (this.lobby.length > 1) {
                    const roomId = this.lobby[0].id;
                    socket.join(roomId);
                    const players = [
                        { id: this.lobby[0].id, name: this.lobby[0].name, mark: Mark.O },
                        { id: this.lobby[1].id, name: this.lobby[1].name, mark: Mark.X }
                    ];
                    const board = Array(3).fill('').map(() => Array(3).fill(''));
                    this.rooms.push({ roomId, players, board });
                    this.io.in(roomId).emit('startGame', { roomId, players });
                    this.lobby = [];
                }
            });
            socket.on('onMove', ({ roomId, position, mark }) => {
                const { board, players } = this.rooms.find(room => room.roomId === roomId);
                board[position.rowI][position.colI] = mark;
                const markWinner = this.hasWinner(board);
                if (markWinner) {
                    const { name } = players.filter((player) => player.mark === markWinner)[0];
                    this.io.in(roomId).emit('onWinner', name);
                }
                this.io.in(roomId).emit('updateBoard', board);
            });
        });
    }
    get app() {
        return this._app;
    }
}
GameServer.PORT = 3333;
exports.default = GameServer;
//# sourceMappingURL=GameServer.js.map