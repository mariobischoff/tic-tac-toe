export default class Board {
  private board: string[][] = [];

  constructor (width = 3, height = 3) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.board[i][j] = ''
      }
    }
  }

  private hasCompleteLine (line: string[]): boolean {
    let numberOfIdendicalMarks = 0
    line.reduce((pre, cur) => {
      if (cur === pre) numberOfIdendicalMarks++
      return cur
    }, line[0])
    return numberOfIdendicalMarks === line.length
  }
}
