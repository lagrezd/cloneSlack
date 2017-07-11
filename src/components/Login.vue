<template>
    <div class="container ui middle aligned center aligned grid login__container">
        <div class="column">
            <h2 class="ui orange header">
                <div class="content">
                    #Slack Clone#
                </div>
            </h2>
            <form class="ui large form" :class="{'error' : hasErrors}">
                <div class="ui stacked segment">

                    <div class="field">
                        <div class="ui left icon input">
                            <i class="mail icon"></i>
                            <input type="email" name="email" placeholder="Email" v-model.trim="email" required>
                        </div>
                    </div>

                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" placeholder="Mot de passe" v-model.trim="password" required>
                        </div>
                    </div>

                    <div class="ui fluid large orange button" @click.prevent="login" :class="{ 'loading': isLoading }">Se connecter</div>
                </div>

                <div class="ui error message" v-if="hasErrors">
                    <p v-for="error in errors">{{ error }}</p>
                </div>

            </form>

            <div class="ui message">
                Créer un compte <router-link to="/register">S'inscrire</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    export default {
      name: 'login',
      data () {
        return {
          email: '',
          password: '',
          errors: [],
          isLoading: false
        }
      },
      computed: {
        hasErrors () {
          return this.errors.length > 0
        }
      },
      methods: {
        login () {
          this.errors = []
          if (this.isFormValid()) {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
              this.$store.dispatch('setUser', user)
              this.$router.push('/')
            }).catch(error => {
              this.errors.push(error.message)
              this.isLoading = false
            })
          }
          return false
        },
        isFormValid () {
          this.isLoading = true
          if (this.email.length > 0 && this.password.length > 0) {
            return true
          }
          return false
        }
      }
    }
</script>

<style scoped>
    .login__container {
        margin-top: 40px;
    }
    .column {
        max-width: 450px;
    }
</style>
