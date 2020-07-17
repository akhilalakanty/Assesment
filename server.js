const express = require('express')
const bodyParser = require('body-parser')
const {logger} = require("./logger");  //importing winston logger service module from logger.js file
var path = require("path");


const PORT = 3000
const api = require('./routes/api')

const app = express()


app.use(bodyParser.json())
app.use('/api', api)

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());



//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****

require('dns').lookup(require('os').hostname(), function (err, add) {
  console.log('addr: ' + add);
});



app.listen(PORT, function(){
  logger.info('Server started running on port:' + PORT)
    console.log('server running successfully on port:' + PORT)
})