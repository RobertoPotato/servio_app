const { separator } = require("../constants");

// async middleware for trycatch blocks
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      console.log("asyncMiddleware ran");
      await handler(req, res);
    } catch (ex) {
      console.log(ex.message);
      next(ex);
    }
  };
};
