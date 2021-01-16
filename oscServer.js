const OSC = require('osc-js');
const os = require('os');
const { address } = os.networkInterfaces().Ethernet.find(({family}) => family === 'IPv4');

const wsPort = 8080;
const udpPort = 41234;

const osc = new OSC({
  plugin: new OSC.BridgePlugin({
    receiver: 'ws',         // @param {string} Where messages sent via 'send' method will be delivered to, 'ws' for Websocket clients, 'udp' for udp client
    udpServer: {
      host: 'localhost',    // @param {string} Hostname of udp server to bind to
      port: udpPort,          // @param {number} Port of udp server to bind to
      exclusive: false      // @param {boolean} Exclusive flag
    },
    udpClient: {
      host: 'localhost',    // @param {string} Hostname of udp client for messaging
      port: 41235           // @param {number} Port of udp client for messaging
    },
    wsServer: {
      host: '0.0.0.0',    // @param {string} Hostname of WebSocket server
      port: wsPort            // @param {number} Port of WebSocket server
    }
  })
})

osc.open() // start a WebSocket server on port 8080
console.log(`listening at ${address}`)
console.log(`WS Port ${wsPort}`)
console.log(`UDP Port ${udpPort}`)
