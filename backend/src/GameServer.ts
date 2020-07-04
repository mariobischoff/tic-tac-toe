import express, { Application } from 'express'

import socketIO from 'socket.io'
import cors from 'cors'

import { Server, createServer } from 'http'
import { GameEvent, Mark } from './constants'
import { Player } from 'types'

class GameServer {
  public static readonly PORT: number = 3333;

  private _app: Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  private lobby: Player[];
  private rooms: any[];

  constructor () {
    this._app = express()
    this.port = process.env.PORT || GameServer.PORT
    this._app.use(cors())
    this.lobby = []
    this.rooms = []
    this.server = createServer(this._app)
    this.initSocket()
    this.listen()
  }

  private initSocket (): void {
    this.io = socketIO(this.server)
  }

  private hasWinner (board: string[][]): string | false {
    const boardDiagonal = []
    for (const i in board) {
      // verifyLine
      if (this.hasCompleteLine(board[i])) {
        return board[i][0]
      }
      // verifyColumn
      const boardColumn = board.map(x => x[i])

      if (this.hasCompleteLine(boardColumn)) {
        return boardColumn[0]
      }
      // diagonal
      for (const j in board[i]) {
        if (i === j) {
          boardDiagonal.push(board[i][j])
        }
      }
    }
    if (this.hasCompleteLine(boardDiagonal)) {
      return boardDiagonal[0]
    }
    return false
  }

  private hasCompleteLine (line: string[]): boolean {
    let numberOfIdendicalMarks = 0
    line.reduce((pre, cur) => {
      if (cur === pre) numberOfIdendicalMarks++
      return cur
    }, line[0])
    return numberOfIdendicalMarks === line.length
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port)
    })

    this.io.on('connect', (socket: SocketIO.Socket) => {
      const { id } = socket

      // search for game
      socket.on('searchGame', (name: string) => {
        const player: Player = { id, name }

        this.lobby.push(player)

        if (this.lobby.length > 1) {
          const roomId: string = this.lobby[0].id

          socket.join(roomId)

          const players: Player[] = [
            { id: this.lobby[0].id, name: this.lobby[0].name, mark: Mark.O },
            { id: this.lobby[1].id, name: this.lobby[1].name, mark: Mark.X }
          ]

          const board: string[][] = Array(3).fill('').map(() => Array(3).fill(''))

          this.rooms.push({ roomId, players, board })

          this.io.in(roomId).emit('startGame', { roomId, players })

          this.lobby = []
        }
      })

      socket.on('onMove', ({ roomId, position, mark }) => {
        const { board, players } = this.rooms.find(room => room.roomId === roomId)

        board[position.rowI][position.colI] = mark

        const markWinner = this.hasWinner(board)
        if (markWinner) {
          const { name } = players.filter((player: Player) => player.mark === markWinner)[0]

          this.io.in(roomId).emit('onWinner', name)
        }
        this.io.in(roomId).emit('updateBoard', board)
      })
    })
  }

  get app (): Application {
    return this._app
  }
}

export default GameServer
