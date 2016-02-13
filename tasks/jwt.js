var jwt = require('jsonwebtoken')
module.exports = function(ctx, done) {
    var data = ctx.data
    var sign = data.sign
    if(!sign) return done(new Error("Undefined param sign"), null)
    delete data["sign"]
    var token = jwt.sign(data, sign)
    done(null, token)
}