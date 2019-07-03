const path = require('path');
const multer = require('multer');
const DataUri = require('datauri');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

/**
 * @description This function converts the buffer to a data url
 *
 * @param {Object} req containing the field object
 *
 * @returns {String} The data url from the string buffer
 */
const dataUri = (req) => new DataUri().format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = { multerUploads, dataUri };