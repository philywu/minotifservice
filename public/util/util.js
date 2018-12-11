import GLOBAL from '../scripts/constants.js';

class Util {
    /**
     * set default values to        
     * @param {json class} sourceJson
     * @param {Array[String]} fields to be set   
     * @param {String} defaultValue    
     */
    static setDefaultValue(sourceJson,fields,defaultValue = "") {
        
        if (sourceJson && typeof sourceJson == "object" && fields){
        //if json class exist        
            //   for (key in sourceJson){
            //       if (!sourceJson[key]) {
            //         sourceJson[key] = defaultValue;
            //       }
            //   }
         switch (fields.constructor) {
             case String :
                
                if (!sourceJson[fields]) {
                    sourceJson[fields] = defaultValue;
                }
                break; 
             case Array : 
                for (name of fields){
                    if (!sourceJson[name]) {
                        sourceJson[name] = defaultValue;
                    }
                }
                break;
         }
         
        } 
    }
    static getFullServerURL(service,param){
        let serverURL = GLOBAL.API_URL;
        serverURL += "/" + service;
        
        return serverURL;
    }
    static clearChildNodes(element){
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }  
    }
    //convert value to HTML format
    static toHTMLFormat(value){
        if (value && (typeof value ==="string")){
            let retValue = value.replace(/\n/g, "<br>");
            return retValue;
        } else {
            return value;
        }
        
    }
    static urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      
}
class RemoteUtil {
    static async getJsonFromAPIServer(serviceName, param) {
        const url = Util.getFullServerURL(serviceName);
        try {
            let res = await fetch(url);            
            return res.json();
        } catch(err) {
            return null; 
        }
        
    }
    static async sendJsonToAPIServer(serviceName,postBody,sendMethod,header) {
        const url = Util.getFullServerURL(serviceName);
        if (!sendMethod){
            sendMethod="POST";
        }
        if (!header){
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        }
        try {
            const rawResponse = await fetch(url, {                
                method: sendMethod,
                headers: header,
                 body:JSON.stringify(postBody)
                //body:postBody
            });
            return await rawResponse.json()
        } catch(err) {
            return null; 
        }
    }
   
    static async login(loginInfo){
        if (!loginInfo){
            return false; 
        }
        let returnJson = await RemoteUtil.sendJsonToAPIServer( GLOBAL.API_SERVICE.LOGIN,loginInfo);

       console.log("response",returnJson);
       if (returnJson.result === "true"){
         sessionStorage.setItem("userId", returnJson.id);
         sessionStorage.setItem("userName",returnJson.firstName+" "+returnJson.lastName);
         sessionStorage.setItem("userEmail", returnJson.email);
         return true;
       } else {
           return false ;
       }
    }
 
}
export {Util,RemoteUtil}