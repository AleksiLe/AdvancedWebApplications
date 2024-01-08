const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    if(authHeader) {
        console.log("Token found");
        jwt.verify(authHeader, process.env.SECRET, (err, user) => {
            if(err) return res.sendStatus(401);
            req.user = user;
            next();
        });
    } else {
        req.user = null;
        next();
    }
};
