load('application');

before(loadDevice, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New device';
    this.device = new Device;
    render();
});

action(function create() {
    Device.create(req.body.Device, function (err, device) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: device && device.errors || err});
                } else {
                    send({code: 200, data: device.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Device can not be created');
                    render('new', {
                        device: device,
                        title: 'New device'
                    });
                } else {
                    flash('info', 'Device created');
                    redirect(path_to.devices);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Devices index';
    Device.all(function (err, devices) {
        switch (params.format) {
            case "json":
                send({code: 200, data: devices});
                break;
            default:
                render({
                    devices: devices
                });
        }
    });
});

action(function show() {
    this.title = 'Device show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.device});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Device edit';
    switch(params.format) {
        case "json":
            send(this.device);
            break;
        default:
            render();
    }
});

action(function update() {
    var device = this.device;
    this.title = 'Edit device details';
    this.device.updateAttributes(body.Device, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: device && device.errors || err});
                } else {
                    send({code: 200, data: device});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Device updated');
                    redirect(path_to.device(device));
                } else {
                    flash('error', 'Device can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.device.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy device');
                } else {
                    flash('info', 'Device successfully removed');
                }
                send("'" + path_to.devices + "'");
            });
        });
    });
});

function loadDevice() {
    Device.find(params.id, function (err, device) {
        if (err || !device) {
            if (!err && !device && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.devices);
        } else {
            this.device = device;
            next();
        }
    }.bind(this));
}
