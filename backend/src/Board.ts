export default class Board {
  private _board: string[][];

  constructor () {
    this._board = [['', '', ''], ['', '', ''], ['', '', '']]
  }

  set board (value: string[][]) {
    this._board = value
  }

  get board (): string[][] {
    return this._board
  }

  public setMark (i: number, j: number, mark: string): void {
    this._board[i][j] = mark
  }

  public resetBoard (): void {
    this._board = [['', '', ''], ['', '', ''], ['', '', '']]
  }

  private hasCompleteLine (array: any[]): boolean {
    const prevElement = array[0]
    for (let index = 1; index < array.length; index++) {
      const element = array[index]
      if (element !== prevElement || prevElement === '') return false
    }
    return true
  }

  public hasWinner (): string | false {
    const diagonalOne: string[] = []
    const diagonalTwo: string[] = []

    for (let i = 0; i < this._board.length; i++) {
      // verifyLine
      if (this.hasCompleteLine(this._board[i])) {
        return this._board[i][0]
      }

      // verifyColumn
      const boardColumn = this._board.map(x => x[i])
      if (this.hasCompleteLine(boardColumn)) {
        return boardColumn[0]
      }

      // diagonal
      for (let j = 0; j < this._board[i].length; j++) {
        if (i === j) {
          diagonalOne.push(this._board[i][j])
          diagonalTwo.push(this._board[i][(this._board.length - 1) - j])
        }
      }
    }
    if (this.hasCompleteLine(diagonalOne) || this.hasCompleteLine(diagonalTwo)) {
      return diagonalOne[1]
    }

    return false
  }
}
