function methodNotAllowed(req, res, next) {
    next({
        status: 405,
        message: `${req.method} not allwoed for ${req.originalUrl}`
    })
}

module.exports = methodNotAllowed