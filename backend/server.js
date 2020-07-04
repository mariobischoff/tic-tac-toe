const app = require('express')()
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(cors())

let readyToPlay = []
const rooms = []

io.on('connection', (socket) => {
  const { id } = socket

  socket.on('searchGame', (name) => {
    readyToPlay.push({ name, id })
    if (readyToPlay.length > 1) {
      const roomId = readyToPlay[0].id
      socket.join(roomId)

      const players = [
        { name: readyToPlay[0].name, mark: 'x' },
        { name: readyToPlay[1].name, mark: 'o' }
      ]

      const board = Array(3).fill().map(() => Array(3).fill(''))

      rooms.push({ roomId, players, board })

      io.in(roomId).emit('startGame', { roomId, players })

      readyToPlay = []
    }
  })

  socket.on('onMove', ({ roomId, position, mark }) => {
    const { board, players } = rooms.find(room => room.roomId === roomId)

    board[position.rowI][position.colI] = mark

    // TODO: verify
    const markWinner = hasWinner(board)
    if (markWinner) {
      const { name } = players.filter(player => player.mark === markWinner)[0]
      io.in(roomId).emit('winner', name)
    }

    io.in(roomId).emit('updateBoard', board)
  })
})

function hasWinner (board) {
  const boardDiagonal = []
  for (const i in board) {
    // verifyLine
    if (hasCompleteLine(board[i])) {
      return `${board[i][0]}`
    }
    // verifyColumn
    const boardColumn = board.map(x => x[i])

    if (hasCompleteLine(boardColumn)) {
      return `${boardColumn[0]}`
    }
    // diagonal
    for (const j in board[i]) {
      if (i === j) {
        boardDiagonal.push(board[i][j])
      }
    }
  }
  if (hasCompleteLine(boardDiagonal)) {
    return `${boardDiagonal[0]}`
  }
  return false
}

function hasCompleteLine (line) {
  let numberOfIdendicalMarks = 0
  line.reduce((pre, cur) => {
    if (cur === pre) numberOfIdendicalMarks++
    return cur
  }, line[0])
  return numberOfIdendicalMarks === line.length
}

http.listen(3333, () => {
  console.log('listening on *:3333')
})
