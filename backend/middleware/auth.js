const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    const token = req.body || req.query || req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send("Auth token not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = decoded
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }

    return next();
}

module.exports = {
    verify
}