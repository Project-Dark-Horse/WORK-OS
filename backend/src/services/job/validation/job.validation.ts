import Joi from 'joi';

export const validateJob = (data: any) => {
  const schema = Joi.object({
    taskTopic: Joi.string().required().min(5).max(255),
    description: Joi.string().required().min(20),
    paymentAmount: Joi.number().required().min(1),
    expectedDeadline: Joi.date().required().greater('now'),
    tags: Joi.array().items(Joi.string()).min(1).required(),
  });

  return schema.validate(data);
};

export const validateJobUpdate = (data: any) => {
  const schema = Joi.object({
    taskTopic: Joi.string().min(5).max(255),
    description: Joi.string().min(20),
    paymentAmount: Joi.number().min(1),
    expectedDeadline: Joi.date().greater('now'),
    tags: Joi.array().items(Joi.string()).min(1),
  });

  return schema.validate(data);
};