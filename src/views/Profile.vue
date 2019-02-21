<template>
  <div class="flex justify-center">
    <div class="flex flex-col">
      <h1 class="text-2xl mt-5 mb-1" v-if="me">Hello, {{ me.name }}!</h1>
      <h5 v-if="peer" class="block text-grey-darker text-sm font-bold mb-5" for="email">
        Your connection id is: <strong class="text-green-dark">{{peer.id}}</strong>
      </h5>
      <h5 v-else class="block text-red-dark font-weight-bold text-sm font-bold mb-5" for="email">
        Couldn't establish connection to server
      </h5>

      <video v-if="callSrc" width="1280" height="720" autoplay class="center-block" :srcObject.prop='callSrc'></video>
      
      <div v-if="!stream && incomingCall">
        <h5 v-if="!conn.open" class="block text-grey-darker text-sm font-bold mt-5 mb-2" for="email">
          <strong class="text-green-dark">{{caller}}</strong> wants to connect with you
        </h5>
        <button :disabled='!peer' @click="acceptConnection" :class="{ 'hover:bg-green opacity-50 cursor-not-allowed' : !peer  }" class="bg-green w-full hover:bg-green-light my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          Connect
        </button>
        <button @click="declineConnection" class="bg-white hover:bg-red-light text-white font-semibold py-2 px-4 border bg-red rounded shadow">
          Disconnect
        </button>
      </div>

      <form v-if="!stream && !incomingCall" @submit.prevent="connect">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="email">
          Your friend's connection id
        </label>
        <input v-model="connectionId" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" required type="text" placeholder="ID">
        <button :disabled='!peer' type="submit" :class="{ 'hover:bg-green opacity-50 cursor-not-allowed' : !peer  }" class="bg-green w-full hover:bg-green-light my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          Connect to your friend
        </button>
      </form>

      <div v-else>
        <h5 v-if="!conn.open" class="block text-grey-darker text-sm font-bold mt-5 mb-2" for="email">
          Connecting...
        </h5>
        <h5 v-else class="block text-green-dark text-sm font-bold mt-5 mb-2" for="email">
          Connected to {{connectionId}}
        </h5>
        <button @click="disconnect" class="bg-white hover:bg-red-light text-white font-semibold py-2 px-4 border bg-red rounded shadow">
          Disconnect
        </button>
      </div>

      <button @click="logout" class="bg-white hover:bg-grey-lightest mt-5 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
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
      peer: null,
      incomingCall: false,
      caller: '',
      conn: null,
      call: null,
      stream:null,
      callSrc: null,
      connectionId: ''
    }
  },
  methods: {
    logout () {
      onLogout(this.$apollo.provider.defaultClient)
      this.$router.push({name: 'Login'})
    },
    connect() {
      let that = this;
      this.conn = this.peer.connect(this.connectionId)
      //peer.on('connection', function(conn) { cut and insert the code block below here });

      this.conn.on('open', function() {
        console.log('Connected to ' + that.connectionId)

        // Receive messages
        that.conn.on('data', function(data) {
          console.log(data)
        });

        // Send messages
        that.conn.send('Greetings from ' + that.me.name);
      });

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        that.stream = stream
        that.call = that.peer.call(that.connectionId, that.stream)  
        that.call.on('that.stream', function(stream) {
          that.callSrc = stream
        });
      })
      .catch(function(err) {
        console.log(err)
      });
    },
    disconnect() {
      if (this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop(); });
      }
      this.stream = ''
      this.connectionId = ''
    }
  },
  mounted() {
    let params = {
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: [
          { url: 'stun:stun.l.google.com:19302' },
          { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        ]
      }
    }
    this.peer = new Peer(Math.random().toString(36).substr(2, 5), params)
    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id)
    });
    this.peer.on('call', function (call) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        that.stream = stream
        call.answer(that.stream)
        call.on('stream', function(stream) {
          that.callSrc = stream
        });
      })
      .catch(function (err) {
        console.log('caca')
      })
    })
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
