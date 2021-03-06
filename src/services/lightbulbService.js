'use strict';

class lightbulbService {

  constructor (platform, accessory) {
    
    this.platform = platform;
    this.log = platform.log;
    this.api = platform.api;
    this.config = platform.config;
    
    this.meApi = platform.meApi;
    
    this.getService(accessory);

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  // Services
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  getService (accessory) {
    
    const that = this;
    
    let service = accessory.getService(this.api.hap.Service.Lightbulb);
    
    if (!service) {
      service = accessory.addService(this.api.hap.Service.Lightbulb, 'Lights', 'lightbulb');
    }
    
    service
      .getCharacteristic(this.api.hap.Characteristic.On)
      .on('set', this.setState.bind(this, accessory, service))
      .on('change', function(value) {
        that.log(accessory.displayName + ': Front/Rear light ' + (value?'on':'off'));
      });
      
    this.getState(accessory, service);

  }
  
  getState (accessory, service){ 
    
    let response = accessory.context.config.vehicleData;
    let value = []; //0=off 1=on
    
    accessory.context.lightValue = accessory.context.lightValue ? accessory.context.lightValue : 0;
    
    if(response.length){
    
      for(const key in response){
      
        if(response[key].interiorLightsFront && (response[key].interiorLightsFront.value === 'true')){
          
          value.push(1);
          
        } else if(response[key].interiorLightsRear && (response[key].interiorLightsRear.value === 'true')){
          
          value.push(1);
          
        } else if(response[key].readingLampFrontLeft && (response[key].readingLampFrontLeft.value === 'true')){
          
          value.push(1);
          
        } else if(response[key].readingLampFrontRight && (response[key].readingLampFrontRight.value === 'true')){
          
          value.push(1);
          
        }
        
      }
      
    }
    
    accessory.context.lightValue = value.includes(1) ? 1 : 0;
    
    service.getCharacteristic(this.api.hap.Characteristic.On).updateValue(accessory.context.lightValue);

    setTimeout(this.getState.bind(this, accessory, service), 5000);
    
  }
  
  setState (accessory, service, value, callback){
    
    const that = this;
    
    this.log(accessory.displayName + ': Can not change light state. Not supported at the moment!');
        
    setTimeout(function(){
      
      service.getCharacteristic(that.api.hap.Characteristic.On).updateValue(value?false:true);   
      
      accessory.context.lightValue = value ? false : true;
      
    }, 500);
    
    service.getCharacteristic(this.api.hap.Characteristic.On).updateValue(value);
    
    callback();
    
  }

}

module.exports = lightbulbService;