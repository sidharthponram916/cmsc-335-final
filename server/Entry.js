const { Schema, model } = require('mongoose')

const entrySchema = new Schema({ 
    locationType: { 
        type: String, 
        required: true
    }, 
    name: { 
        type: String, 
        required: true
    }, 
    lastVisited: { 
        type: Date, 
        required: true
    }
})

module.exports = model("entries", entrySchema)