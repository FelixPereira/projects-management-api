const mongoose = require('mongoose');
const Joi = require('joi');

const projectSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pendente',
    required: true
  },
  percentageConclusion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    requred: true
  },
  startDate: {
    type: Date
  },
  conlusionDate: {
    type: Date
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  projects: [projectSchema]
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required(),
    telephone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
  });
  return schema.validate(user);
}

module.exports.User = mongoose.model('User', userSchema);
module.exports.validate = validateUser;