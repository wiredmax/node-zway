var _ = require("lodash");
var moment = require("moment");

var rest, mime, client;

rest = require('rest'),
mime = require('rest/interceptor/mime');

client = rest.wrap(mime);
client({ path: 'http://10.0.50.10:8083/ZWaveAPI/Data/0' }).then(function(res) {
  var response = res.entity;
  var allDevices = res.entity;

  var controllerId = allDevices.controller.data.nodeId.value;

  _.forEach(allDevices.devices, function(device, deviceId) {
    if (deviceId == 255 || deviceId == controllerId || device.data.isVirtual.value) {
      return;
    }
    console.log("### " + device.data.givenName.value + " (" + deviceId + ") ###");

    _.forEach(device.instances, function(instance, instanceId) {

      if (instanceId == 0 && device.instances.length > 1) {
        return;
      }

      var sensorBinary = instance.commandClasses[0x30];
      var sensorMultilevel = instance.commandClasses[0x31];

      if(_.isObject(sensorBinary)) {
        console.log("\nBinary sensors:");
        _.forEach(sensorBinary.data, function(val, key) {
          // Not a sensor type
          var sensorType = parseInt(key, 10);
          if (isNaN(sensorType)) {
              return;
          }

          console.log("(" + key + ") " + val.sensorTypeString.value + ": " + val.level.value + " (" + moment.unix(val.updateTime).format("LLL") + ")")
        });
      }

      if(_.isObject(sensorMultilevel)) {
        console.log("\nMulti-Level sensors:");
        _.forEach(sensorMultilevel.data, function(val, key) {
          // Not a sensor type
          var sensorType = parseInt(key, 10);
          if (isNaN(sensorType)) {
              return;
          }
          console.log("(" + key + ") " + val.sensorTypeString.value + ": " + val.val.value + " " + val.scaleString.value + " (" + moment.unix(val.updateTime).format("LLL") + ")")
        });
      }

      // FIXME: Add meters and alarms
    });
  });
});

// Inspired from https://github.com/Z-Wave-Me/ExpertUI/blob/79a8955bcdb9e6c8156720ead2688da341358cc2/app/core/controllers/controllers.js