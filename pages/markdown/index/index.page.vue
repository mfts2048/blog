<template>
  <ul>
    <li v-for="item in markdownList" :key="item.key">
      <a :href="`/markdown/${item.key}`">/markdown/{{ item.key }}</a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
interface Option {
  key: string
}

defineProps<{
  markdownList: Option[]
}>()
</script>
