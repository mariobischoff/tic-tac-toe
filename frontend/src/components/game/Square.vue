<template>
  <transition>
    <button
      @click="$emit('press')"
      class="w-24 h-24 m-2 text-center text-green-600 text-6xl rounded bg-indigo-100 shadow-lg"
      :style="mark === 'o'? 'color: red' : 'color: green'"
    >
      {{ mark }}
    </button>
  </transition>
</template>

<script>
export default {
  name: 'Square',
  props: {
    mark: String
  }
}
</script>

<style>

</style>
