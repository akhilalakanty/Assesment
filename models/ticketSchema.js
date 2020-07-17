const mongoose = require('mongoose')

const Schema = mongoose.Schema
const TicketModel= new Schema({
   
    "ticketID": "",
    "subject": "",
    "description": "",
    "createdDateTime": "",
    "lastUpdatedDateTime": "",
    "deadLineDateTime": "",
    "severity": "",
    "assignedTo": "",
    "status": ""
})

module.exports = mongoose.model('fekertech', TicketModel, 'fekertech')