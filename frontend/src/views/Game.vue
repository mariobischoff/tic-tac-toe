<template>
  <main class="h-full flex justify-center">

    <template v-if="!gameStarted">
      <Lobby @loadBoard="startGame" />
    </template>

    <template v-else>
      <div class="flex flex-col justify-center">
        <!-- <div class="flex justify-between">
          <span class="tracking-widest text-green-500 font-black">{{ players[0].name }}</span>
          <span class="tracking-widest text-red-500 font-black">{{ players[1].name }}</span>
        </div> -->
        <Scoreboard />
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
      players: '',
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
  }
}
</script>
