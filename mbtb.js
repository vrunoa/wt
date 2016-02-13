var request = require('request')
module.exports = function(ctx, done) {
    request.get({url:"https://mibicitubici.herokuapp.com/"}, function(err, body, response){
        try {
            var stations = JSON.parse(response)
            var station = ctx.data.station
            if(!station) return done(null, stations)
            stations.map(function(s){
                if(station == s[11]) return done(null, s)
            })
            done(new Error("Station not found: "+station), [])
        }catch(e) {
            done(e, [])
        }
    })
}
