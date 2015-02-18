var _ = require("lodash");

var rest, mime, client;

rest = require('rest'),
mime = require('rest/interceptor/mime');

client = rest.wrap(mime);
client({ path: 'http://10.0.50.10:8083/ZWaveAPI/Data/0' }).then(function(res) {
  var response = res.entity;
  var allDevices = res.entity;

  for(deviceKey in allDevices.devices) {
    for(instance in allDevices.devices[deviceKey].instances) {
      var currentInstance = allDevices.devices[deviceKey].instances[instance];
      var sensorBinary = currentInstance.commandClasses[0x30];
      var sensorMultilevel = currentInstance.commandClasses[0x31];

      if(_.isObject(sensorBinary)) {
        _.forEach(sensorBinary.data, function(val, key) {
          // Not a sensor type
          var sensor_type = parseInt(key, 10);
          if (isNaN(sensor_type)) {
              return;
          }
          console.log(val.sensorTypeString.value + ": " + val.level.value)
        });
      }

      if(_.isObject(sensorMultilevel)) {
        _.forEach(sensorMultilevel.data, function(val, key) {
          // Not a sensor type
          var sensor_type = parseInt(key, 10);
          if (isNaN(sensor_type)) {
              return;
          }
          console.log(val.sensorTypeString.value + ": " + val.val.value + " " + val.scaleString.value)
        });
      }
    }
  }
});

// Inspired from https://github.com/Z-Wave-Me/ExpertUI/blob/79a8955bcdb9e6c8156720ead2688da341358cc2/app/core/controllers/controllers.js
