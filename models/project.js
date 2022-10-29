const mongoose = require('mongoose');
const Joi = require('joi');

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  }
});

const responsibleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
  }
});

const projectSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
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
    min: 0,
    max: 100,
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
    type: clientSchema,
    required: true
  },
  observation: {
    type: String,
    required: false,
    minlength: 5
  },
  responsible: {
    type: responsibleSchema,
  }
});

function validateProject(project) {
  const schema = Joi.object({
    domain: Joi.string().required(),
    status: Joi.string().required(),
    category: Joi.string().required(),
    hostingProvider: Joi.string().required(),
    domainProvider: Joi.string().required(),
    domainExpirationDate: Joi.date().required(),
    percentageConclusion: Joi.number().min(0).max(100).required(),
    wpUser: Joi.string().required(),
    wpPassword: Joi.string().required(),
    startDate: Joi.date().required(),
    conlusionDate: Joi.date().required(),
    lastBackupDate: Joi.date().required(),
    clientInformation: Joi.required(),
    observation: Joi.string().required(),
    responsibleId: Joi.string()
  });

  return schema.validate(project);
};

module.exports.Project = mongoose.model('Project', projectSchema);
module.exports.validate = validateProject;