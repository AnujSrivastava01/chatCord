const moment = require('moment')

const formatMessage = (username, message) =>{
    return {
        username,
        message,
        time: moment().utcOffset("+05:30").format('h:mm a')
    }
}

module.exports = formatMessage;