var _CONFIG_FILE_PATH = "../config/config.json";
class Config {
    
    /* the other way to read file */
    // constructor (async_param) {
    //     if (typeof async_param === 'undefined') {
    //         throw new Error('Cannot be called directly');
    //     }
    //     this.pages = async_param;
    // }

    // static build () {
    //     return Config.getConfigFromJson()
    //        .then(function(async_result){
    //            return new Config(async_result);
    //        });
    // }
    constructor () {
        this.configuration =null; 
    }

    async load (callback,callClass) {
        // do something async and call the callback:
        // this.getConfigFromJson().then(res =>{
        //     this.pages = res ; 
        //     callback.bind(this)();
        // });
        this.configuration = await this.getConfigFromJson();
        //callback.bind(this)();
        callback(this.configuration,callClass);
        
    }
    async getConfigFromJson() {
        if (!this.configuration) {
            try {
                let res = await fetch(_CONFIG_FILE_PATH);
                return res.json();
            } catch(err) {
                return null; 
            }
        } else {
            return this.configuration;
        }
        
    }
}
export {Config}