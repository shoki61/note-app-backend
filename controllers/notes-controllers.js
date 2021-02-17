const validator = require("validator");

const Note = require("../models/note");
const errors = require('../error-messages/messages');

const getNotes = async(req, res, next) => {
    let notes;
    try {
        notes = await Note.find({});
        if(!notes.length){
            return res.status(404).json({message: errors.notFound('Notes')});
        };
        res.status(200).json({notes});
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
};



module.exports = {
    getNotes
};
