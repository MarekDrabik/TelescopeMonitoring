const ws = require('ws')
const TelemetryModel = require('../models/telemetry.model')
const ConnectedClientsContainer = require('../models/connected-clients.model')

module.exports = class RealtimeServer {

  static connectedClientsContainer = new ConnectedClientsContainer()
  static registeredSources = TelemetryModel.getAllRequestableSources()

  listenOn(httpServer) {
    const wss = new ws.Server({server: httpServer}) //use the existing httpserver

    wss.on('connection', (ws, req) => { // ws = websocket created, req = request from client
      
      //console.log('CLIENT:', ws, '\n REQ:', req)	    
      RealtimeServer.connectedClientsContainer.add(ws, req)
      ws.subscribedSources = []
      ws.on('message', (message) => {
        console.log(Date.now(), "request received: ", message)
        if (!this._validRequest(message)) {
          console.error('Invalid realtime request. No action.')
          return
        }
        // Parsing JSON only after validation!
        var messageObj = JSON.parse(message)
        this._processRequest(messageObj, ws)
        console.log("subscribed:",ws.subscribedSources)
      })
      
      ws.on('close', (code, reason) => {
        console.log('connection closed status, reason: ', code, ", ", reason)
        //kick the client from the register
      	RealtimeServer.connectedClientsContainer.removeBySocket(ws)
      })

      ws.on('error', (socket, error) => {
        console.error('error on this socket: ', socket, error)
      })
    })
  }

  _validRequest(message) {
    
    let messageObj;
    try {
      messageObj = JSON.parse(message)
    } catch (err) {
      console.log(err)
      return false
    }

    if (messageObj.hasOwnProperty('subscribe')) {
      if (RealtimeServer.registeredSources.includes(messageObj.subscribe)) {
        return true
      }
    }
    if (messageObj.hasOwnProperty('unsubscribe')) {
      if (RealtimeServer.registeredSources.includes(messageObj.unsubscribe)) {
        return true
      }
    }
    return false
  }

  _processRequest(messageObj, ws) {
    if (messageObj.hasOwnProperty('subscribe')) {
      if (messageObj.subscribe in ws.subscribedSources) {
        console.error('Duplicate subscription request to the source without previous unsubscribe request!')
      } else {
        ws.subscribedSources.push(messageObj.subscribe)
        // ws.send("valid subscribe" + messageObj.subscribe.toString())
        return
      }
    }
    if (messageObj.hasOwnProperty('unsubscribe')) {
      if (!ws.subscribedSources.includes(messageObj.unsubscribe)) {
        console.error('Unsubscribe source request on already unsubscribed source!')
      } else {
        // ws.send("valid unsubscribe" + messageObj.unsubscribe.toString())
        ws.subscribedSources = ws.subscribedSources.filter(source => source !== messageObj.unsubscribe)
        return
      }
    } 
  }

}
