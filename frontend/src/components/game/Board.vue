<template>
  <div class="flex flex-col">
    <div
      v-for="(i, rowIndex) in board"
      :key="rowIndex"
      class="flex justify-center"
    >
      <div v-for="(j, colIndex) in i" :key="colIndex">
        <square :mark="j" @press="makeMove(rowIndex, colIndex)" />
      </div>
    </div>
  </div>
</template>

<script>
import Square from './Square'

export default {
  name: 'Board',
  components: {
    Square
  },
  props: {
    players: Array,
    name: String,
    roomId: String
  },
  data () {
    return {
      board: [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
      ]
    }
  },
  methods: {
    makeMove (rowI, colI) {
      this.$socket.client.emit('onMove', {
        roomId: this.roomId,
        position: { rowI, colI },
        mark: this.playerMark
      })
    }
  },
  computed: {
    playerMark () {
      const player = this.players.find(player => player.name === this.name)
      return player.mark
    }
  },
  sockets: {
    updateBoard (board) {
      this.board = board
    }
  }
}
</script>
