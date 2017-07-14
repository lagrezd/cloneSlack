<template>
    <div class="messages__form">
        <div class="ui inverted form">
            <div class="two fields">
                <div class="field">
                    <textarea name="message" id="message" v-model.trim="message" rows="3" placeholder="Message"></textarea>
                </div>
                <div class="field">
                    <button class="ui green button" @click.prevent="sendMessage">Envoyer</button>
                    <button class="ui labeled icon button" @click.prevent="openFileModal"><i class="cloud icon"></i>Fichier</button>
                </div>
            </div>

            <!-- ProgressBar Upload File -->
            <div class="ui small orange inverted progress" data-total="100" id="uploadedFile" v-if="uploadState != null">
                <div class="bar">
                    <div class="progress"></div>
                </div>
                <div class="label">{{ uploadLabel }}</div>
            </div>

            <file-modal ref="file_modal"></file-modal>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import firebase from 'firebase'
    import FileModal from './FileModal.vue'
    import uuidV4 from 'uuid-v4'
    export default {
      name: 'message-form',
      data () {
        return {
          message: '',
          errors: [],
          storageRef: firebase.storage().ref(),
          uploadTask: null,
          uploadState: null
        }
      },
      computed: {
        ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
        uploadLabel () {
          switch (this.uploadState) {
            case 'uploading':
              return 'Envoi en cours...'
            case 'error':
              return 'Une erreur  s\'est produite lors du téléchargement'
            case 'done':
              return 'Téléchargemet terminé'
          }
        }
      },
      methods: {
        sendMessage () {
          if (this.currentChannel !== null) {
            if (this.message.length > 0) {
              // envoi du message
              this.$parent.getMessagesRef().child(this.currentChannel.id).push().set(this.createMessage()).then(() => {

              }).catch(error => {
                this.errors.push(error.message)
              })

              this.message = ''
            }
          }
        },
        createMessage (fileUrl = null) {
          let message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
              name: this.currentUser.displayName,
              avatar: this.currentUser.photoURL,
              id: this.currentUser.uid
            }
          }
          if (fileUrl === null) {
            message['content'] = this.message // content ou image/fichier
          } else {
            message['image'] = fileUrl
          }
          return message
        },
        uploadFile (file, metadata) {
          if (file === null) return false

          let pathToUpload = this.currentChannel.id
          let ref = this.$parent.getMessagesRef()
          let filePath = this.getPath() + '/' + uuidV4() + '.jpg' // tchat/public/gjlgjchrgmlshcg.jpg

          // Upload du fichier
          this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
          this.uploadState = 'uploading'

          this.uploadTask.on('state_changed', snap => {
            // Upload en cours
            let percent = (snap.bytesTransferred / snap.totalBytes) * 100
            $('#uploadedFile').progress('set percent', percent)
          }, error => {
            // Erreurs
            this.errors.push(error.message)
            this.uploadState = 'error'
            this.uploadTask = null
          }, () => {
            // Upload terminé
            this.uploadState = 'done'

            // reset le form
            this.$refs.file_modal.resetForm()

            // récupérer l'url du fichier
            let fileUrl = this.uploadTask.snapshot.downloadURL
            this.sendFileMessage(fileUrl, ref, pathToUpload)
          })
        },
        sendFileMessage (fileUrl, ref, pathToUpload) {
          ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
            this.$nextTick(() => {
              $('html, body').scrollTop($(document).height())
            })
          }).catch(error => {
            this.errors.push(error.message)
          })
        },
        openFileModal () {
          $('#fileModal').modal('show')
        },
        getPath () {
          if (this.isPrivate) {
            return 'tchat/private/' + this.currentChannel.id // user1/user2
          } else {
            return 'tchat/public'
          }
        }
      },
      beforeDestroy () {
        if (this.uploadTask !== null) {
          this.uploadTask.cancel()
          this.uploadTask = null
        }
      },
      components: {
        FileModal
      }
    }
</script>

<style scoped>
    .messages__form{
        position: fixed;
        bottom: 0;
        background-color:#232323;
        padding: 10px;
        padding-top: 20px;
        height: 210px;
        left: 300px;
        right: 0;
    }
    .messages__form.big{
        height: 350px;
    }
    .shortcut{
        color:white;
    }
</style>
