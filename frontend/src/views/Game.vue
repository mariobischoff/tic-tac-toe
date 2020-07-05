<template>
  <main class="h-full flex justify-center">

    <template v-if="!gameStarted">
      <Lobby @loadBoard="startGame" />
    </template>

    <template v-else>
      <div class="flex flex-col justify-center sm:w-8/12 lg:w-1/2" >
        <Scoreboard :players="players" class="mb-8"/>
        <Board :players="players" :name="name" :roomId="roomId"/>
      </div>
    </template>

  </main>
</template>

<script>
// @ is an alias to /src
import Board from '../components/game/Board'
import Scoreboard from '../components/game/Scoreboard'
import Lobby from '../components/game/Lobby'

export default {
  name: 'Game',
  components: {
    Board,
    Scoreboard,
    Lobby
  },
  data () {
    return {
      name: '',
      roomId: '',
      players: [],
      gameStarted: false
    }
  },
  methods: {
    startGame ({ name, roomId, players }) {
      this.name = name
      this.roomId = roomId
      this.players = players
      this.gameStarted = true
    }
  },
  sockets: {
    onWinner (players) {
      this.players = players
      console.log(this.players)
    }
  }
}
</script>
