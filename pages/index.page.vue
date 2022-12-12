<template>
  <h1>Welcome to <code>vite-plugin-ssr</code></h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
  <p>
    We <code>export const clientRouting = true</code> to enable Client Routing.
    <a href="/markdown/">Markdown Page</a>
  </p>
</template>

<script lang="ts" setup>
import Counter from '../components/Counter.vue'
</script>