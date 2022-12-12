<template>
  <Counter />
  <div class="vp-doc" v-html="props.markdown.content"></div>
</template>

<script lang="ts" setup>
import Counter from '../../../components/Counter.vue'
import '../../../styles/vars.css'
import '../../../styles/code.css'
import '../../../styles/vp-doc.css'

interface Markdown {
  key: string
  title: string
  content: string
  file_name: string
}

const props = defineProps<{
  markdown: Markdown
}>()
</script>

<style lang="less" scoped>
.vp-doc {
  padding-left: 40px;
}
</style>