/*
 * Copyright 2023 Marco Bergman <marcobergman@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const PLUGIN_ID = 'sk-propulsion-state';


module.exports = function(app) {

  const Gpio = require('onoff').Gpio;
  const plugin = {};
  var unsubscribes = [];

  plugin.id = PLUGIN_ID
  plugin.name = "SignalK Propulsion State"
  plugin.description = "SignalK node server plugin that reads a GPIO port and reflects it into propulsion.main.state."



  plugin.start = function(options, restartPlugin) {

	app.debug(PLUGIN_ID + 'Plugin started'); 

	var gpioPort = new Gpio(options.gpioPortNumber, 'in')
	
	interval = setInterval(() => {
		var portValue = gpioPort.readSync()
		var propulsionState = portValue == options.gpioPortValue ? 'started' : 'stopped'
		console.log ("Reading GPIO port", portValue, propulsionState)
		app.handleMessage('my-signalk-plugin', {context: 'vessels.self', updates: [ {values:
			[ { path: 'propulsion.main.state', value: propulsionState } ]
		} ] })
    }, options.updateInterval * 1000);  // every updateInterval seconds
  }; //plugin start



  plugin.stop = function() {
    unsubscribes.forEach(f => f());
    unsubscribes = [];
    app.setPluginStatus("Plugin stopped.");
  };  // plugin.stop



  plugin.schema = {
    type: "object",
    properties: {

      updateInterval: {
        type: 'number',
        title: 'Update interval (seconds)',
        default: 30},

      gpioPortNumber: {
        type: 'number',
        title: 'GPIO input port that tells whether the engine is on or off',
        default: 26},
		
      gpioPortValue: {
        type: 'number',
        title: 'GPIO input value that denotes engine "on"',
        default: 0}
    }
  }  // plugin schema



  function subscription_error(err) {
    app.setPluginError(err)
  }

  return plugin;
}

