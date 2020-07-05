<template>
  <div class="flex justify-between">
    <div class="flex">
      <span class="text-4xl font-bold text-green-700">{{ players[0].point }}</span>
      <span class="m-2 text-xl font-bold text-green-400 self-end tracking-wider uppercase">{{ players[0].name }}</span>
    </div>
    <div class="flex">
      <span class="m-2 text-xl font-bold text-red-400 self-end tracking-wider uppercase">{{ players[1].name }}</span>
      <span class="text-4xl font-bold text-red-700">{{ players[1].point }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scoreboard',
  props: {
    players: Array
  }
}
</script>

<style>

</style>
