import express, { Application } from 'express'

import cors from 'cors'

import socketIO, { Server as SocketIOServer } from 'socket.io'

import { Server as ServerHTTP, createServer } from 'http'

import Board from './Board'

enum Mark {
  X = 'x',
  O = 'o',
}

export enum GameEvent {
  CONNECT = 'connect',
  SEARCH_GAME = 'searchGame ',
  START_GAME = 'startGame',
  ON_MOVE = 'onMove',
  ON_WINNER = 'onWinner',
  UPDATE_BOARD = 'updateBoard',
}

export interface Player {
  name: string;
  id: string;
  mark?: Mark;
  point: number;
  turn?: boolean;
}

class GameServer {
  public static readonly PORT: number = 3333;

  private _app: Application;
  private server: ServerHTTP;
  private io: SocketIOServer;
  private port: string | number;

  private lobby: Player[];
  private rooms: any[];

  constructor () {
    this.port = process.env.PORT || GameServer.PORT
    this.lobby = []
    this.rooms = []
    this._app = express()
    this.configApp()
    this.server = createServer(this._app)
    this.io = socketIO(this.server)
    this.listen()
  }

  private configApp (): void {
    this._app.use(cors())
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port)
    })

    this.io.on('connect', (socket: SocketIO.Socket) => {
      const { id } = socket
      const lastMark = ''

      // search for game
      socket.on('searchGame', (name: string) => {
        const player: Player = { id, name, point: 0 }

        this.lobby.push(player)

        if (this.lobby.length > 1) {
          const roomId: string = this.lobby[0].id

          socket.join(roomId)

          const players: Player[] = [
            {
              id: this.lobby[0].id,
              name: this.lobby[0].name,
              mark: Mark.O,
              point: 0,
              turn: true
            },
            {
              id: this.lobby[1].id,
              name: this.lobby[1].name,
              mark: Mark.X,
              point: 0,
              turn: false
            }
          ]

          const board: Board = new Board()

          this.rooms.push({ roomId, players, board })

          this.io.in(roomId).emit('startGame', { roomId, players })

          this.lobby = []
        }
      })

      socket.on('onMove', ({ roomId, position, mark, turn }) => {
        const { board, players } = this.rooms.find(
          (room) => room.roomId === roomId
        )

        const player = players.filter((player: any) => player.mark == mark)[0]

        if (player.turn) {
          players[0].turn = !players[0].turn
          players[1].turn = !players[1].turn
          board.setMark(position.rowI, position.colI, mark)

          const markWinner = board.hasWinner()

          if (markWinner) {
            const player: Player = players.filter(
              (player: Player) => player.mark === markWinner
            )[0]
            player.point += 1

            board.resetBoard()

            this.io.in(roomId).emit('onWinner', players)
          }

          this.io.in(roomId).emit('updateBoard', board.board)
        }
      })
    })
  }

  get app (): Application {
    return this._app
  }
}

export default GameServer
