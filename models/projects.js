const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    minlength: 6,
  },
  status: {
    type: String,
    required: true,
    default: 'Pendente'
  },
  category: {
    type: String,
    required: true,
  },
  hostingProvider: {
    type: String,
    required: true,
  },
  domainProvider: {
    type: String,
    required: true,
  },
  domainExpirationDate: {
    type: Date,
    required: false,
  },
  percentageConclusion: {
    type: Number,
    required: true,
    get: value => value + '%'
  },
  wpUser: {
    type: String,
    required: true,
  },
  wpPassword: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  conlusionDate: {
    type: Date,
    required: false,
  },
  lastBackupDate: {
    type: Date,
    required: true,
  },
  clientInformation: {
    clientName:  {
      type: String,
      required: true
    },
    clientPhone:  {
      type: String,
      required: true
    },
    clientEmail:  {
      type: String,
      required: true
    }
  },
  observation: {
    type: String,
    required: false,
    minlength: 5
  },
});

/*  clientInformation: {
    clientName:  {
      type: String,
      required: true
    },
    clientPhone:  {
      type: String,
      required: true
    },
    clientEmail:  {
      type: String,
      required: true
    },
  },
*/

module.exports = mongoose.model('Project', projectSchema);