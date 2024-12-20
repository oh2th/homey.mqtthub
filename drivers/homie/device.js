'use strict';

const Homey = require('homey');

class MQTTHomieDiscoveryDevice extends Homey.Device {

	async onInit() {
        this.log('MQTT Homie Discovery Device...');

        // this.setSettings({class: this.getClass()});
        // // update settings from device attributes
        try{
            let energy = this.getEnergy();
            let settings = {};
            settings["set_energy_cumulative"] =  energy["cumulative"] != undefined ? energy["cumulative"] : false;
            settings["set_energy_home_battery"] = energy["homeBattery"] != undefined ? energy["homeBattery"] : false;
            settings["set_energy_cumulative_imported_capability"] = energy["cumulativeImportedCapability"] != undefined ? energy["cumulativeImportedCapability"] : "";
            settings["set_energy_cumulative_exported_capability"] = energy["cumulativeExportedCapability"] != undefined ? energy["cumulativeExportedCapability"] : "";
            await this.setSettings(settings);
        }
        catch(error){
            this.error("Error updating device enrergy settings: "+error.message);
        }
        
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
        if (changedKeys.indexOf('set_energy_cumulative_imported_capability') > -1){
            if (newSettings['set_energy_cumulative_imported_capability'] != undefined){
                this.log("onSettings(): set_energy_cumulative_imported_capability: "+newSettings['set_energy_cumulative_imported_capability']);
                await this._setEnergyCumulativeImportedCapability(newSettings['set_energy_cumulative_imported_capability']);
            }
        }
        if (changedKeys.indexOf('set_energy_cumulative_exported_capability') > -1){
            if (newSettings['set_energy_cumulative_exported_capability'] != undefined){
                this.log("onSettings(): set_energy_cumulative_exported_capability: "+newSettings['set_energy_cumulative_exported_capability']);
                await this._setEnergyCumulativeExportedCapability(newSettings['set_energy_cumulative_exported_capability']);
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

    async _setEnergyCumulativeImportedCapability(value){
        let energy = JSON.parse(JSON.stringify(this.getEnergy()));
        if (value == ''){
            delete  energy["cumulativeImportedCapability"];
        }
        else{
            energy["cumulativeImportedCapability"] =  value;
        }
        await this.setEnergy( energy );
    }

    async _setEnergyCumulativeExportedCapability(value){
        let energy = JSON.parse(JSON.stringify(this.getEnergy()));
        if (value == ''){
            delete energy["cumulativeExportedCapability"];
        }
        else{
            energy["cumulativeExportedCapability"] =  value;
        }
        await this.setEnergy( energy );
    }

}

module.exports = MQTTHomieDiscoveryDevice;