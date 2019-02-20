<template>
  <div class="flex justify-center">
    <div class="flex flex-col">
      <h1 class="text-2xl py-5" v-if="me">Hello, {{ me.name }}!</h1>
      <button @click="connect" class="bg-green hover:bg-green-light my-4 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
        Connect to your friend
      </button>
      <button @click="logout" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { onLogout } from '../vue-apollo.js'
import gql from 'graphql-tag'
import Peer from 'peerjs'

export default {
  name: 'Profile',

  data () {
    return {
      me: null,
      peer: null
    }
  },
  methods: {
    logout () {
      onLogout(this.$apollo.provider.defaultClient)
      this.$router.push({name: 'Login'})
    },
    connect() {
      var conn = this.peer.connect('bobi');
      //peer.on('connection', function(conn) { cut and insert the code block below here });

      conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
      });
    }
  },
  mounted() {
    this.peer = new Peer('aldo'); //change to bobi when testing
    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id)
    });
  },
  apollo: {
    me: gql`query {
      me {
        id
        name
        email
      }
    }
    `,
    hello: gql`
      query {
        hello @client {
          msg
        }
      }
    `
  },
}
</script>
