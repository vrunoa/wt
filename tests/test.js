var chai = require('chai')
var child = require('child_process')
var should = chai.should()
var expect = chai.expect
var jwt = require('jsonwebtoken')

describe("test webtasks", function(){
   it("Test jwt.js webtask", function(done){
        var task = "https://webtask.it.auth0.com/api/run/wt-vruno_alassia-gmail_com-0/jwt\?webtask_no_cache\=1"
        var spawn = child.spawnSync("curl", [task])
        var stdout = spawn.stdout+""
        var err = JSON.parse(stdout)
        err.error.should.equal('Script returned an error.')
        err.message.should.equal('Undefined param sign')
        task+="\&sign\=shhhh\&name\=bruno\&lastName\=alassia"
        var spawn = child.spawnSync("curl", [task])
        var token = spawn.stdout+""
        token = token.replace(/"/ig,"")
        token.should.not.equal(undefined)
        token.should.not.equal(null)
        var decoded = jwt.verify(token, "shhhh")
        expect(decoded).to.be.a("object")
        decoded.name.should.equal("bruno")
        decoded.lastName.should.equal("alassia")
        done()
    })
    it("Test hello.js webtask", function(done){
        var spawn = child.spawnSync("curl", [
            "https://webtask.it.auth0.com/api/run/wt-vruno_alassia-gmail_com-0/hello\?webtask_no_cache\=1"
            ])
        var stdout = spawn.stdout+""
        stdout.should.equal('"Hello"')
        done()
    })
    it("Test timestamp.js webtask", function(done){
        var spawn = child.spawnSync("curl", [
            "https://webtask.it.auth0.com/api/run/wt-vruno_alassia-gmail_com-0/timestamp\?webtask_no_cache\=1"
            ])
        var stdout = spawn.stdout+""
        var date = new Date(parseInt(stdout))
        date.should.not.equal("Invalid Date")
        var timestamp = date.getTime()
        timestamp.should.equal(parseInt(stdout))
        done()
    })
    it("Test mbtb.js webtask", function(done){
        var task = "https://webtask.it.auth0.com/api/run/wt-vruno_alassia-gmail_com-0/mbtb\?webtask_no_cache\=1"
        var spawn = child.spawnSync("curl", [task])
        var stdout = spawn.stdout+""
        var stations = JSON.parse(stdout)
        expect(stations).to.be.a("array")
        stations.map(function(station){
            expect(station).to.be.a("array")
            station.length.should.equal(14)
            return station
        })
        var len = stations.length
        for(var i=0;i<len; i++) {
            var station = stations[i]
            var filtered_task = [task, "&station\=", station[11]].join("")
            var spawn = child.spawnSync("curl", [filtered_task])
            var stdout = spawn.stdout+""
            var st = JSON.parse(stdout)
            expect(st).to.be.a("array")
            st.length.should.equal(14)
            parseInt(st[11]).should.equal(parseInt(station[11]))
        }
        var no_station = i+1
        var filtered_task = [task, "&station\=", no_station].join("")
        var spawn = child.spawnSync("curl", [filtered_task])
        var stdout = spawn.stdout+""
        var st = JSON.parse(stdout)
        st.error.should.equal('Script returned an error.')
        st.message.should.equal("Station not found: "+no_station)
        done()
    })
})