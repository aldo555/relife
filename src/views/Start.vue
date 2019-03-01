<template>
  <div class="flex justify-center p-5">
    <div class="flex flex-col">
      <h1 class="text-3xl mb-1" v-if="me">Hello, {{ me.name }}!</h1>
      <h5 v-if="peer" class="block text-grey-darker text-sm font-bold mb-10" for="email">
        Your connection id is: <strong class="text-green-dark">{{peer.id}}</strong>
      </h5>
      <h5 v-else class="block text-red-dark font-weight-bold text-sm font-bold mb-10" for="email">
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
        <button :disabled='!peer' type="submit" :class="{ 'hover:bg-indigo-darkest opacity-50 cursor-not-allowed' : !peer  }" class="bg-indigo-darkest w-full hover:bg-indigo-darker my-3 text-white font-semibold py-2 px-4 border border-grey-light rounded shadow">
          Connect to your friend
        </button>
      </form>

      <div v-if="offerResponseMsg!=''" class="bg-indigo-lightest border border-indigo-light text-indigo-dark px-4 py-3 rounded relative mt-3" role="alert">
        <strong class="font-bold">Request status:</strong>&nbsp;
        <span class="block sm:inline">Offer {{offerResponseMsg}}!.</span>
        <span class="absolute pin-t pin-b pin-r px-4 pt-2" @click="clearMessage">
          <svg class="fill-current h-6 w-6 text-indigo-darkest" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>


      <form v-if="stream!=null && callSrc!=null && conn!=null" class="w-full mt-5" @submit.prevent="submitOffer">
        <div v-if="!waitingOfferResponse">
          <div class="w-full flex">
            <label for="requestMsg" class="w-1/3 mr-5 py-2">Request</label>
            <input id="requestMsg" required="required" class="shadow appearance-none border rounded w-2/3 py-2 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="requestMsg"/>
          </div>
          <div class="w-full flex">
            <button @click="changeValue(5)" type="submit" class="text-white bg-indigo-darkest hover:bg-indigo-dark w-full hover:bg-green-light my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow md:w-1/3">$5</button>
            <button @click="changeValue(10)" type="submit" class="text-white bg-indigo-darkest hover:bg-indigo-dark my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow md:w-1/3">$10</button>
            <button @click="changeValue(15)" type="submit" class="text-white bg-indigo-darkest hover:bg-indigo-dark my-3 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow md:w-1/3">$15</button>
          </div>
        </div>
        <div v-if="waitingOfferResponse">
          <h5 class="block text-grey-darkest text-sm font-bold">Waiting response from streamer!</h5>
        </div>

      </form>

      <div v-if="offerReceived" class="w-full py-4">
        <h5 class="block text-white text-sm font-bold">Request received!</h5>
        <div class="w-full">
          <p class="w-full">{{requestMsg}}</p>
          <p class="w-full">The reward is ${{requestValue}}</p>
          <div class="justify-between  block md:flex">
            <button @click="offerResponse('accept')" class="w-full mx-1 text-white bg-green hover:bg-green-light mt-3 text-grey-darkest font-semibold py-2 px-4 rounded shadow">Accept</button>
            <button @click="offerResponse('reject')" class="w-full mx-1 text-white bg-red hover:bg-red-light mt-3 text-grey-darkest font-semibold py-2 px-4 rounded shadow">Decline</button>
          </div>
        </div>
      </div>

      <h5 v-if="conn && conn.open &&!callSrc && stream" class="block text-grey-darker text-sm font-bold mt-5 mb-2">
        Connecting...
      </h5>
      <h5 v-if="conn && conn.open && callSrc" class="block text-green-dark text-sm font-bold mt-5 mb-2">
        Connected to {{connectionId}}
      </h5>
      <button v-if="conn && conn.open && stream" @click="disconnect" class="hover:bg-red-light text-white font-semibold py-2 px-4 border bg-red rounded shadow">
        Disconnect
      </button>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Peer from 'peerjs'

export default {
  name: 'Start',

  data () {
    return {
      me: null,
      peer: null,
      incomingCall: false,
      conn: null,
      call: null,
      stream: null,
      callSrc: null,
      connectionId: '',
      requestMsg: '',
      requestValue: '',
      offerReceived: false,
      waitingOfferResponse: false,
      offerResponseMsg: ''
    }
  },
  methods: {
    clearMessage: function () {
      this.offerResponseMsg = ''
    },
    submitOffer: function () {
      let request = {
        'message': this.requestMsg,
        'value': this.requestValue,
        'type': 'offer'
      }
      this.waitingOfferResponse = true
      this.conn.send(request)
    },
    getOffer: function (data) {
      this.requestMsg = data.message
      this.requestValue = data.value
      this.offerReceived = true
    },
    offerResponse: function (answer) {
      let response = null
      if (answer === 'accept') {
        response = {
          'message': 'accepted',
          'type': 'offerResponse'
        }
      } else {
        response = {
          'message': 'declined',
          'type': 'offerResponse'
        }
      }
      this.conn.send(response)
      this.offerReceived = false
    },
    changeValue: function (value) {
      this.requestValue = value
    },
    connect () {
      let that = this
      this.conn = this.peer.connect(this.connectionId, { metadata: { name: this.me.name } })

      that.conn.on('data', function (data) { // This checks if we receive offer response from the one that we are viewing
        if (data.type === 'offerResponse') {
          that.waitingOfferResponse = false
          that.requestMsg = ''
          that.offerResponseMsg = data.message
          console.log(data)
        } else {
          console.log(data)
        }
      })

      that.conn.on('close', function () {
        that.waitingOfferResponse = false
        that.offerReceived = false
        that.requestMsg = ''
        that.offerResponseMsg = ''
      })

      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function (stream) {
          that.stream = stream
          that.call = that.peer.call(that.connectionId, that.stream)
          that.call.on('stream', function (stream) {
            that.callSrc = stream
          })
        })
        .catch(function (err) {
          console.log(err)
        })
    },

    disconnect () {
      if (this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop() })
      }
      this.conn.close()
      this.conn = null
      this.call = null
      this.stream = null
      this.callSrc = null
      this.connectionId = ''
      this.offerResponseMsg = ''
    },

    acceptConnection () {
      let that = this
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function (stream) {
          that.stream = stream
          that.call.answer(that.stream)
          that.call.on('stream', function (stream) {
            that.callSrc = stream
          })
          that.incomingCall = false
        })
        .catch(function (err) {
          console.log(err)
        })
    },

    declineConnection () {
      this.call.close()
      this.conn.close()
      this.incomingCall = false
    }
  },
  mounted () {
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
    // this.peer.on('open', function(id) {
    //   console.log('My peer ID is: ' + id)
    // })

    let that = this

    this.peer.on('connection', function (conn) {
      that.conn = conn

      that.conn.on('close', function () {
        if (that.stream) {
          that.stream.getTracks().forEach(function (track) { track.stop() })
        }
        that.conn = null
        that.call = null
        that.stream = null
        that.callSrc = null
        that.connectionId = ''
        that.incomingCall = false
        this.offerResponseMsg = ''
      })
    })

    this.peer.on('call', function (call) {
      that.call = call
      that.connectionId = call.peer
      that.incomingCall = true
      that.conn.on('data', function (data) {
        if (data.type === 'offer') { // this checks what offer we get from our watcher
          that.getOffer(data)
        } else {
          console.log(data)
        }
      })
      that.conn.on('close', function () {
        that.waitingOfferResponse = false
        that.offerReceived = false
      })
    })
  },
  updated () {
    // checking if call was ended by answerer
    if (this.conn && !this.conn.open && this.callSrc) {
      if (this.stream) {
        this.stream.getTracks().forEach(function (track) { track.stop() })
      }
      this.conn = null
      this.call = null
      this.stream = null
      this.callSrc = null
      this.connectionId = ''
    }

    // checking if call was ended by answerer
    // if (this.conn && !this.conn.open && this.call && !this.call.open) {
    //   if (this.stream) {
    //     this.stream.getTracks().forEach(function (track) { track.stop() })
    //   }
    //   this.conn = null
    //   this.call = null
    //   this.stream = null
    //   this.callSrc = null
    //   this.connectionId = ''
    // }
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
  }
}
</script>
