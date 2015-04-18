var request = require("superagent");
var _ = require("lodash");

function lampSwitch(switchLevel) {
  request
  .get("http://10.0.50.10:8083/ZWaveAPI/Run/devices[3].instances[0].SwitchMultilevel.Set("+ switchLevel +")")
  .end(function(err, res){
    // Calling the end function will send the request
  });
}

if(!_.isUndefined(process.argv[2])) {
  if(process.argv[2].toLowerCase() === "on") {
    console.log("Turning lamp ON!");
    lampSwitch(99);
  }
  else if(process.argv[2].toLowerCase() === "off") {
    console.log("Turning lamp OFF!");
    lampSwitch(0);
  }
  else {
    console.log("Invalid argument. You need to provide on/off argument.")
  }
}
else {
  console.log("You need to provide on/off argument.");
}