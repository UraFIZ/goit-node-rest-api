import HttpError from "../helpers/HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    
    if (Object.keys(req.body).length === 0) {
      next(HttpError(400, "Body must have at least one field"));
      return;
    }

    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateBody;
