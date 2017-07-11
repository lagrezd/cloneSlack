<template>
    <div class="tchat__container">
        <sidebar></sidebar>
        <messages></messages>
    </div>
</template>

<script>
    import Sidebar from '../components/Sidebar.vue'
    import Messages from '../components/Messages.vue'
    export default {
      name: 'tchat',
      data () {
        return {
        }
      },
      components: {
        Sidebar,
        Messages
      }
    }
</script>

<style scoped>
    .tchat__container {
        height:100%;
    }
</style>
