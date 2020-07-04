<template>
  <div class="flex flex-col justify-center my-auto p-8 rounded shadow-lg bg-gray-100">
    <div class="font-sans text-lg font-bold text-center">Welcome to a tic-tac-toe game</div>
    <div class="font-sans text-center">this game is made with Vue, Socket.io <br> and Express</div>
    <div class="flex justify-between my-4 px-6">
      <img src="../../assets/logo-vue.png" class="h-12 w-12" alt="vue-logo">
      <img src="../../assets/logo-socket.svg" class="h-12 w-12" alt="vue-logo">
      <img src="../../assets/logo-express.png" class="w-32" alt="vue-logo">

    </div>
    <form @submit.prevent="join" class="flex justify-center  ">
      <input
        class="h-10 rounded-l-md pl-2 border-solid border-indigo-300 border text-gray-700 leading-tight"
        type="text"
        placeholder="Type your name"
        v-model="name"
        :disabled="isLoading"
      >
      <button
        class="flex justify-center items-center h-10 w-16 bg-indigo-500 hover:bg-indigo-600  text-white font-bold px-2 rounded-r-md"
        type="submit"
        :disabled="isLoading"
      >
        <PulseLoader :loading="isLoading" size="8px"/>
        {{ isLoading ? '' : 'Join' }}
      </button>
    </form>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'lobby',
  components: {
    PulseLoader
  },
  props: {
    startGame: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      name: '',
      isLoading: false
    }
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    startGame ({ roomId, players }) {
      this.isLoading = false
      this.$emit('loadBoard', { roomId, name: this.name, players })
    }
  },
  methods: {
    join () {
      this.$socket.client.emit('searchGame', this.name)
      this.isLoading = true
    }
  }
}
</script>
