<template>
  <transition>
    <button
      @click="$emit('press')"
      :class="{ 'text-green-600': mark === 'o' }"
      class="w-24 h-24 m-2 text-center text-red-600 text-6xl rounded bg-indigo-100 shadow-lg"
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
