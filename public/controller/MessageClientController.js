import GLOBAL from '../scripts/constants.js';
import {BaseController} from "./BaseController.js";
import {
    RemoteUtil
} from "../util/util.js";

const NOTIFICATION_SENDER1 = "hitools"
class MessageClientController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        console.log("message");
        super.init(app);
        // let headerLeft = document.getElementById("headerLeft");
        this.setNotification();
        this.registerEvent();
        
    }
  
    registerEvent() {
        //bind this
        
        //nav bar
        const navBar = document.getElementById("task_tabs");
        if (navBar) {
            let list = navBar.querySelectorAll("li > a");
            for (let navItem of list) {
                navItem.addEventListener("click", this.clickNavItemAction)
            }
        }
        // set for allow checkbox
        let chk = document.querySelector('#i_allow_hightools');
        this.actionSetNotification = this.actionSetNotification.bind(this);
        chk.addEventListener("change", this.actionSetNotification);

        // document.querySelector("#b_submit").addEventListener("click", (evt) =>{
        //     console.log ("click");
        // })
        
    }
    
    
    clickNavItemAction(e) {
        console.log(e.target.id);
    }
    setNotification() {
        const uid = this.app.user.uid;
        const chkAllow1 = document.querySelector("#i_allow_hightools")
        RemoteUtil.getJsonFromAPIServer(GLOBAL.API_SERVICE.NOTIF_PROFILE+"/"+GLOBAL.NOTIFICATION_SENDER+"/"+uid).then( json =>{
            console.log(json);
            if (json.settings){
                chkAllow1.checked = json.settings.allowpush ; 
                
            } else {
                chkAllow1.checked = false;
            }
        });
    }
    async actionSetNotification(evt) {
        console.log(navigator.userAgent);
       const isChecked = evt.target.checked;
       const content = {
           messageSender:GLOBAL.NOTIFICATION_SENDER,
           messageReceiver: this.app.user,
           settings :{              
               allowpush: isChecked
           }
       };
       let subscription = await this.app.subscribeUser();
       console.log(subscription);
       if (isChecked){
        content.subscription = subscription;
       
        } else {
            content.subscription = null;
        }
       RemoteUtil.sendJsonToAPIServer(GLOBAL.API_SERVICE.NOTIF_PROFILE,content).then((json)=>{
        console.log(json);
       
        });
       
       
    }

}
export {MessageClientController};