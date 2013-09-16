var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function DeviceStub () {
    return {
        allowed: '',
        note: '',
        app_version: '',
        model: '',
        region: ''
    };
}

describe('DeviceController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /devices/new
     * Should render devices/new.ejs
     */
    it('should render "new" template on GET /devices/new', function (done) {
        request(app)
        .get('/devices/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/devices\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /devices
     * Should render devices/index.ejs
     */
    it('should render "index" template on GET /devices', function (done) {
        request(app)
        .get('/devices')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/devices\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /devices/:id/edit
     * Should access Device#find and render devices/edit.ejs
     */
    it('should access Device#find and render "edit" template on GET /devices/:id/edit', function (done) {
        var Device = app.models.Device;

        // Mock Device#find
        Device.find = sinon.spy(function (id, callback) {
            callback(null, new Device);
        });

        request(app)
        .get('/devices/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Device.find.calledWith('42').should.be.true;
            app.didRender(/devices\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /devices/:id
     * Should render devices/index.ejs
     */
    it('should access Device#find and render "show" template on GET /devices/:id', function (done) {
        var Device = app.models.Device;

        // Mock Device#find
        Device.find = sinon.spy(function (id, callback) {
            callback(null, new Device);
        });

        request(app)
        .get('/devices/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Device.find.calledWith('42').should.be.true;
            app.didRender(/devices\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /devices
     * Should access Device#create when Device is valid
     */
    it('should access Device#create on POST /devices with a valid Device', function (done) {
        var Device = app.models.Device
        , device = new DeviceStub;

        // Mock Device#create
        Device.create = sinon.spy(function (data, callback) {
            callback(null, device);
        });

        request(app)
        .post('/devices')
        .send({ "Device": device })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Device.create.calledWith(device).should.be.true;

            done();
        });
    });

    /*
     * POST /devices
     * Should fail when Device is invalid
     */
    it('should fail on POST /devices when Device#create returns an error', function (done) {
        var Device = app.models.Device
        , device = new DeviceStub;

        // Mock Device#create
        Device.create = sinon.spy(function (data, callback) {
            callback(new Error, device);
        });

        request(app)
        .post('/devices')
        .send({ "Device": device })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Device.create.calledWith(device).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /devices/:id
     * Should redirect back to /devices when Device is valid
     */
    it('should redirect on PUT /devices/:id with a valid Device', function (done) {
        var Device = app.models.Device
        , device = new DeviceStub;

        Device.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/devices/1')
        .send({ "Device": device })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/devices/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /devices/:id
     * Should not redirect when Device is invalid
     */
    it('should fail / not redirect on PUT /devices/:id with an invalid Device', function (done) {
        var Device = app.models.Device
        , device = new DeviceStub;

        Device.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/devices/1')
        .send({ "Device": device })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /devices/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Device on DELETE /devices/:id');

    /*
     * DELETE /devices/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Device on DELETE /devices/:id if it fails');
});
