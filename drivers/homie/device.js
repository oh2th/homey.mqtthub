'use strict';

const Homey = require('homey');

class MQTTHomieDiscoveryDevice extends Homey.Device {

	onInit() {
        this.log('MQTT Homie Discovery Device...');

        this.setSettings({class: this.getClass()});
        
        // NOTE: This device is never initialized.
        // The Homie Discovery driver adds a pre-configured MQTT Device
        // see driver.onMapDeviceClass(device)
    }

    async onSettings({oldSettings, newSettings, changedKeys}) {
        // device class
        if (changedKeys.indexOf('class') > -1){
            let deviceClass = newSettings['class'];
            if (deviceClass != undefined && deviceClass != "" && deviceClass != this.getClass()){
                await this.setClass(deviceClass);
                this.log("onSettings(): Device class changed to: "+deviceClass);
            } 
        }
        // Energy settings
        if (changedKeys.indexOf('set_energy_cumulative') > -1){
            if (newSettings['set_energy_cumulative']){
                this.log("onSettings(): set_energy_cumulative SET");
                await this._setEnergyCumulative(true);
            }
            else{
                this.log("onSettings(): set_energy_cumulative UNSET");
                await this._setEnergyCumulative(false);
            } 
        }
        if (changedKeys.indexOf('set_energy_home_battery') > -1){
            if (newSettings['set_energy_home_battery']){
                this.log("onSettings(): set_energy_home_battery SET");
                await this._setEnergyHomeBattery(true);
            }
            else{
                this.log("onSettings(): set_energy_home_battery UNSET");
                await this._setEnergyHomeBattery(false);
            } 
        }
    }

    // Energy settings ================================================================================================
    async _setEnergyCumulative(value = false){
        await this.setEnergy(
            { "cumulative": value }
        );
    }

    async _setEnergyHomeBattery(value = false){
        await this.setEnergy(
            { "homeBattery": value }
        );
    }

}

module.exports = MQTTHomieDiscoveryDevice;