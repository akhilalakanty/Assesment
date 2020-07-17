const express = require('express')   //importing express module from npm
const router = express.Router()      //importing Router module from express
var random = require('randomstring');  //importing randomString generator module from npm
const { logger } = require("../logger");  //importing winston logger service module from logger.js file

const TicketModel = require('../models/ticketSchema')  //importing ticket model from ticketSchema.js from models folder

const mongoose = require('mongoose')   //importing mongoose module from npm

const db = "mongodb+srv://sense:sense@cluster0-4mlmu.mongodb.net/Assesments?retryWrites=true&w=majority" //db connection link generated in mlab 


///////////////////////////Making connection to database/////////////////////////
mongoose.connect(db, err => {
    if (err) {
        logger.info('ERROR: There is a problem in connection to database' + err)
        console.log('There is a problem in connection to database' + err)
    }
    else {
        logger.info('SUCCESS: Sucessfully connected to database')
        console.log('Sucessfully connected to database')
    }
})
///////////////////////////End of Making connection to database/////////////////////////

////////////////////////////1) API for Creating ticket//////////////////////////////////////
router.post('/v1/tickets/create', (req, res) => {
    logger.info('Started creating ticket')
    let ticketData = req.body
    let date = new Date();
    let Uniqueid = date.getTime() | 0;
    if (!ticketData.subject || !ticketData.description || !ticketData.deadLineDateTime || !ticketData.severity) {     // validating subject,description,deadLineDateTime,severity fields

        logger.info('ERROR Validation: subject,description,deadLineDateTime,severity fields cannot be empty')
        res.status(401).send('subject,description,deadLineDateTime,severity fields cannot be empty');
        return;
    }

    if (ticketData.severity != "low" && ticketData.severity != "medium" && ticketData.severity != "high") {  // validating severity field
        logger.info('ERROR Validation: Sevierity can be one of "low", "medium", "high" and cannot be empty')
        res.status(401).send('Sevierity can be one of "low", "medium", "high"');
        return;
    }

    let ticketobj = {
        "ticketID": Uniqueid + random.generate(10),
        "subject": ticketData.subject,
        "description": ticketData.description,
        "createdDateTime": date,
        "lastUpdatedDateTime": "",
        "deadLineDateTime": ticketData.deadLineDateTime,
        "severity": ticketData.severity,
        "assignedTo": "",
        "status": "initiated"
    };
    TicketModel.insertMany(ticketobj, (error) => {
        logger.info("Started inserting new record to database")
        if (error) {
            logger.info('ERROR: Error occured while inserting record to DB' + error)
            res.status(401).send('There is a problem in creating ticket please try after sometime!')
        } else {
            logger.info("SUCCESS: Created Ticket Successfully with ticketId: " + ticketobj.ticketID)
            res.status(200).send({ "success": "Created Ticket Successfully with ticketId: " + ticketobj.ticketID })
        }
    })
})
////////////////////////////Endof API for Creating ticket//////////////////////////////////////

////////////////////////////2) API for Updating ticket//////////////////////////////////////
router.post('/v1/tickets/updateAssignedTo', (req, res) => {
    logger.info("Started updating assignedTo field")
    let ticketData = req.body
    if (!ticketData.assignedTo) {                                                  // Validating assigned field
        logger.info("ERROR Validation: 'assignedTo' field cannot be empty")
        res.status(401).send('Sorry assignedTo field cannot be empty')
        return;
    }

    let date = new Date();
    TicketModel.findOneAndUpdate({ "ticketID": ticketData.ticketID }, { "assignedTo": ticketData.assignedTo, "lastUpdatedDateTime": date }, { useFindAndModify: false }, (error, ticket) => {
        logger.info("Started updating assignedTo field into DB")
        if (error) {
            logger.info('ERROR: Error occured while updating assignedTo field to DB' + error)
            console.log(error)
            res.status(401)
        } else if (!ticket) {
            logger.info("ERROR Validation: there is no such ticket ID exists, unable to update assignedTo field")
            res.status(401).send('Sorry there is no such ticket ID exists')
        } else {
            logger.info("SUCCESS: " + "Assigned ticket to " + ticketData.assignedTo)
            res.status(200).send({ "success": "Assigned ticket to " + ticketData.assignedTo })

        }
    })
})
////////////////////////////Endof API for Updating ticket//////////////////////////////////////

////////////////////////////3) API for Updating status//////////////////////////////////////
router.post('/v1/tickets/updateStatus', (req, res) => {
    logger.info("Started updating status field in db")
    let ticketData = req.body
    let date = new Date();
    let isStatusvalid = 0;
    ValidStatus = ['initiated', 'assigned', 'stuck', 'completed', 'testing', 'closed']   // can enter all valid status types
    for (let i = 0; i < ValidStatus.length; i++) {
        if (ticketData.status == ValidStatus[i]) {
            logger.info("validating status entered")                                         // Validating status field
            isStatusvalid = 1;
            break;
        }
    }
    if (isStatusvalid) {      // if entered status is valid then it gets updated
        logger.info("success: Status validation succeeded proceeding to update record")
        TicketModel.findOneAndUpdate({ "ticketID": ticketData.ticketID }, { "status": ticketData.status, "lastUpdatedDateTime": date }, { useFindAndModify: false }, (error, ticket) => {
            logger.info("Started inserting value to ticket")
            if (error) {
                logger.info('ERROR: Error occured while inserting status field to DB' + error)
                console.log(error)
                res.status(401)
            } else if (!ticket) {
                logger.info("ERROR Validation: there is no such ticket ID exists. cannot update status field")
                res.status(401).send('Sorry there is no such ticket ID exists')
            } else {
                logger.info("SUCCESS: Updated Ticket Status Successfully with new status.")
                
                res.status(200).send({ "success": "Updated Ticket Status Successfully." })

            }
        })
    } else {
        logger.info("ERROR Validation: the entered status is not valid.")
        res.status(401).send('Sorry the entered status is not valid')
    }
})

////////////////////////////Endof API for Updating status//////////////////////////////////////

////////////////////////////4) API for Updating Dead line//////////////////////////////////////
router.post('/v1/tickets/updateDeadLine', (req, res) => {
    logger.info("Started updating ticket with deadLineDateTime field")
    let ticketData = req.body
    if (!ticketData.deadLineDateTime) {                                              // Validating deadLineDateTime field
        logger.info("ERROR Validation: deadLineDateTime field cannot be empty")
        res.status(401).send('Sorry deadLineDateTime field cannot be empty')
        return;
    }

    let date = new Date();
    TicketModel.findOneAndUpdate({ "ticketID": ticketData.ticketID }, { "deadLineDateTime": ticketData.deadLineDateTime, "lastUpdatedDateTime": date }, { useFindAndModify: false }, (error, ticket) => {
        logger.info("Started inserting value to ticket")
        if (error) {
            logger.info('ERROR: Error occured while inserting deadLineDateTime field to DB' + error)
            console.log(error)
            res.status(401)
        } else if (!ticket) {
            logger.info("ERROR Validation: there is no such ticket ID exists. cannot update deadLineDateTime field")
            res.status(401).send('Sorry there is no such ticket ID exists')
        } else {
            logger.info("SUCCESS: Updated Ticket Deadline Successfully with deadLineDateTime field")
            
            res.status(200).send({ "success": "Updated Ticket Deadline Successfully." })

        }
    })
})
////////////////////////////Endof API for Updating Dead line//////////////////////////////////////


module.exports = router