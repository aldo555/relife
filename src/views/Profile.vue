<template>
  <div class="flex justify-center p-5">
    <div class="flex flex-col">
      <h1 class="text-2xl mt-5 mb-1" v-if="me">Hello, {{ me.name }}!</h1>
      <h5 v-if="peer" class="block text-grey-darker text-sm font-bold mb-5" for="email">
        Your connection id is: <strong class="text-green-dark">{{peer.id}}</strong>
      </h5>
      <h5 v-else class="block text-red-dark font-weight-bold text-sm font-bold mb-5" for="email">
        Couldn't establish connection to server
      </h5>

      <video v-if="conn && conn.open && callSrc" autoplay class="center-block w-full" :srcObject.prop='callSrc'></video>
      
      <div v-if="!callSrc && incomingCall">
        <h5 v-if="conn && !conn.open" class="block text-grey-darker text-sm font-bold mt-5 mb-2" for="email">
          <strong class="text-green-dark">{{connectionId}}</strong> wants to connect with you
        </h5>
        <button :disabled='!peer' @click="acceptConnection" :class="{ 'hover:bg-green opacity-50 cursor-not-allowed' : !peer  }" class="bg-green w-full hover:bg-green-light my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          Connect
        </button>
        <button @click="declineConnection" class="bg-white hover:bg-red-light text-white font-semibold py-2 px-4 border bg-red rounded shadow w-full">
          Reject
        </button>
      </div>

      <form v-if="!callSrc && !incomingCall && !conn || (conn && !conn.open)" @submit.prevent="connect">
        <label class="block text-grey-darker text-sm font-bold mb-2">
          Your friend's connection id
        </label>
        <input v-model="connectionId" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" required type="text" placeholder="ID">
        <button :disabled='!peer' type="submit" :class="{ 'hover:bg-green opacity-50 cursor-not-allowed' : !peer  }" class="bg-green w-full hover:bg-green-light my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          Connect to your friend
        </button>
      </form>

      <h5 v-if="conn && conn.open &&!callSrc && stream" class="block text-grey-darker text-sm font-bold mt-5 mb-2">
        Connecting...
      </h5>
      <h5 v-if="conn && conn.open && callSrc" class="block text-green-dark text-sm font-bold mt-5 mb-2">
        Connected to {{connectionId}}
      </h5>
      <button v-if="conn && conn.open && stream" @click="disconnect" class="bg-white hover:bg-red-light text-white font-semibold py-2 px-4 border bg-red rounded shadow">
        Disconnect
      </button>

      <button @click="logout" class="bg-white hover:bg-grey-lightest mt-10 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
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
      conn: null,
      call: null,
      stream:null,
      callSrc: null,
      connectionId: '',
    }
  },
  methods: {
    logout () {
      onLogout(this.$apollo.provider.defaultClient)
      this.$router.push({name: 'Login'})
    },

    connect() {
      let that = this;
      this.conn = this.peer.connect(this.connectionId, { metadata: { name: this.me.name } })

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        that.stream = stream
        that.call = that.peer.call(that.connectionId, that.stream)  
        that.call.on('stream', function(stream) {
          that.callSrc = stream
        });
      })
      .catch(function(err) {
        console.log(err)
      });
    },

    disconnect() {
      if(this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop(); })
      }
      this.conn.close()
      this.conn = null
      this.call = null
      this.stream = null
      this.callSrc = null
      this.connectionId = ''
    },

    acceptConnection() {
      let that = this;
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        that.stream = stream
        that.call.answer(that.stream)
        that.call.on('stream', function(stream) {
          that.callSrc = stream
        });
        that.incomingCall = false
      })
      .catch(function (err) {
        console.log(err)
      })
    },

    declineConnection() {
      this.call.close();
      this.conn.close();
      this.incomingCall = false
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
          { url: 'turn:aftermath-studio.go.ro:3478', credential: 'Acasa55@', username: 'aftermath' }
        ]
      }
    }
    this.peer = new Peer(Math.random().toString(36).substr(2, 5), params)
    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id)
    })

    let that = this;
    
    this.peer.on('connection', function(conn) {
      that.conn = conn

      that.conn.on('close', function() {
        console.log('call ended')
        if(that.stream) {
          that.stream.getTracks().forEach(function (track) { track.stop(); })
        }
        that.conn = null
        that.call = null
        that.stream = null
        that.callSrc = null
        that.connectionId = ''
      })
    });

    this.peer.on('call', function (call) {
      that.call = call
      that.connectionId = call.peer
      that.incomingCall = true;
    })
  },
  updated() {
    //checking if call was ended by answerer
    if (this.conn && !this.conn.open && this.callSrc) {
      if(this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop(); })
      }
      this.conn = null
      this.call = null
      this.stream = null
      this.callSrc = null
      this.connectionId = ''
    }

    //checking if call was rejected
    if (this.conn && !this.conn.open && this.call && !this.call.open) {
      if(this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop(); })
      }
      this.conn = null
      this.call = null
      this.stream = null
      this.callSrc = null
      this.connectionId = ''
    }
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
