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
  clientInformation: {
    type: Array,
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
  startDate: {
    type: Date,
    required: true,
  },
  conlusionDate: {
    type: Date,
    required: false,
  },
  lastBackup: {
    type: Date,
    required: true,
  },
  observation: {
    type: String,
    required: false,
    minlength: 5
  },
  wpUser: {
    type: String,
    required: true,
  },
  wpPassword: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Project', projectSchema);