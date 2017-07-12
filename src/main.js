// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import firebase from 'firebase'
import store from './store'

// Initialize Firebase
let config = {
  apiKey: 'AIzaSyDJ-vGnYTdkzpOkOcwWFQ7KvYphTgxpZWE',
  authDomain: 'slack-clone-c4b99.firebaseapp.com',
  databaseURL: 'https://slack-clone-c4b99.firebaseio.com',
  projectId: 'slack-clone-c4b99',
  storageBucket: 'slack-clone-c4b99.appspot.com',
  messagingSenderId: '523623004507'
}
firebase.initializeApp(config)

window.firebase = firebase

Vue.config.productionTip = false

const unsuscribe = firebase.auth().onAuthStateChanged(user => {
  // initialise la store
  store.dispatch('setUser', user)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })

  unsuscribe() // pour ne pas charger plusieurs fois la vue
})
