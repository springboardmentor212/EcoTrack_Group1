const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({
          message: `${field} is required.`,
        });
      }
    }

    next();
  };
};

module.exports = validateRequiredFields;
