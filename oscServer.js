const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const https = require('https');
const OSC = require('osc-js');
const os = require('os');
const _ = require('lodash');

const rawIds = {};
const rawLinks = [];

const handleRow = ({ id, senderuserid, receiveruserid, eventtime, event }) => {
  const senAccum = rawIds[senderuserid] || { sent: 0, received: 0 };
  const recAccum = rawIds[receiveruserid] || { sent: 0, received: 0 };

  if (event === 'pending') {
    senAccum.sent = senAccum.sent + 1;
  } else {
    recAccum.received = recAccum.received + 1;
  }

  rawIds[senderuserid] = senAccum;
  rawIds[receiveruserid] = recAccum;

  rawLinks.push({ source: senderuserid, target: receiveruserid, event });

  // if (event === 'accepted') {
  //   rawLinks.push({ target: senderuserid, source: receiveruserid, event });
  // }
  // if (event === 'declined') {
  //   rawLinks.push({ target: senderuserid, source: receiveruserid, event });
  // }
  // if (event === 'pending') {
  // }
  // console.log(id, links.length)
}

fs.createReadStream(path.resolve(__dirname, 'Likes-SoulSingles-2021.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', handleRow)
  .on('end', (rowCount) => {
    console.log(`Parsed ${rowCount} rows`);

    // const ids = _(rawIds)
    //   .values()
    //   .sampleSize(100)
    //   .map(id => [id, id])
    //   .fromPairs()
    //   .value();


    // const links = _.sampleSize(rawLinks, 5000);
    const thresh = 150;
    const links = _(rawLinks)
      .filter(({ source, target }) => _.every([
        rawIds[source].received > thresh || rawIds[source].sent > thresh,
        rawIds[target].sent > thresh || rawIds[target].received > thresh,
      ]))
      .sampleSize(10000)
      .value();

    const ids = {};
    links.forEach(({ source, target }) => {
      ids[source] = source;
      ids[target] = target;
    });
    const nodes = _.keys(ids).map(id => ({ id, sent: rawIds[id].sent, received: rawIds[id].received }));

    // artificial "Myspace Tom"
    // nodes.push({id: '0'})
    // nodes.forEach(({id}) => {
    //   links.push({ target: '0', source: id, event: 'pending' });
    // })


    // const links = rawLinks.filter(({ source, target  }) => {
    //   console.log(source, target, _.includes(ids, source), _.includes(ids, target) )
    //
    //   return _.includes(ids, source) && _.includes(ids, target);
    // })


    // console.log('linkCount:', links.length)

    fs.writeFileSync(path.resolve(__dirname, 'src/likes.json'), JSON.stringify({
      nodes,
      links,
    }));

    console.log(`Wrote JSON`);
  });




/*


const server = https.createServer({
  host: '0.0.0.0',
  cert: fs.readFileSync('./certificate.crt'),
  key: fs.readFileSync('./privatekey.key')
});

// const { address } = os.networkInterfaces().Ethernet.find(({family}) => family === 'IPv4');

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
      // host: '0.0.0.0',    // @param {string} Hostname of WebSocket server
      // port: wsPort,            // @param {number} Port of WebSocket server
      server, // FIXME: had to modify WebSocketServer plugin to accept this option. maybe ditch osc-js or fork it
    }
  })
})
server.listen(wsPort);
osc.open() // start a WebSocket server on port 8080
// console.log(`listening at ${address}`)
console.log(`WS Port ${wsPort}`)
console.log(`UDP Port ${udpPort}`)
*/
