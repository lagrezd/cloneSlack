<template>
    <div class="messages__container">
        <div class="messages__content">
            <h2 class="ui inverted center aligned header">{{ channelName }}</h2>
            <div class="ui segment">
                <div class="ui comments">
                    <!--span v-for="message in messages">{{ message.content }}</span-->
                    <transition-group tag="div" name="list">
                        <single-message v-for="message in messages" :message="message" :key="message.id"></single-message>
                    </transition-group>
                </div>
            </div>
        </div>
        <message-form></message-form>
    </div>
</template>

<script>
  import firebase from 'firebase'
  import { mapGetters } from 'vuex'
  import MessageForm from './MessageForm.vue'
  import SingleMessage from './SingleMessage.vue'
  export default {
    name: 'messages',
    data () {
      return {
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messages: [],
        channel: null,
        listeners: []
      }
    },
    computed: {
      ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
      channelName () {
        if (this.channel !== null) {
          return this.isPrivate ? '@ ' + this.channel.name : '# ' + this.channel.name
        }
      }
    },
    components: {
      MessageForm,
      SingleMessage
    },
    watch: {
      currentChannel () {
        this.detachListeners()
        this.addListeners()

        this.channel = this.currentChannel
      }
    },
    methods: {
      addListeners () {
        let ref = this.getMessagesRef()
        ref.child(this.currentChannel.id).on('child_added', snap => {
          // récupérer le message.id
          let message = snap.val()
          message['id'] = snap.key
          this.messages.push(message)
          this.$nextTick(() => {
            $('html, body').scrollTop($(document).height())
          })
        })
        this.addToListeners(this.currentChannel.id, ref, 'child_added')
      },
      addToListeners (id, ref, event) {
        let index = this.listeners.findIndex(el => {
          return el.id === id && el.ref === ref && el.event === event
        })
        if (index === -1) {
          this.listeners.push({
            id: id,
            ref: ref,
            event: event
          })
        }
      },
      detachListeners () {
        this.listeners.forEach(listener => {
          listener.ref.child(listener.id).off(listener.event)
        })
        this.listeners = []
        this.messages = []
      },
      getMessagesRef () {
        if (this.isPrivate) {
          return this.privateMessagesRef
        } else {
          return this.messagesRef
        }
      }
    },
    beforeDestroy () {
      this.detachListeners()
    }
  }
</script>

<style scoped>
    .messages__container{
        position: relative;
        background-color: grey;
        padding: 10px 30px 210px 30px;
        margin-left: 300px;
        min-height: 100%;
    }
    .messages__container .comments{
        font-size: 1.2em;
    }
    .list-enter-active{
        transition: all 0.3s
    }
    .list-enter, .list-leave-to{
        opacity: 0;
        transform: translateX(30px);
    }
</style>
