import GLOBAL from '../scripts/constants.js';
import {
    BaseController
} from "./BaseController.js";
import {
    RemoteUtil
} from "../util/util.js";
class MessageMainController extends BaseController {
    constructor(args) {
        super(args);

        this.receiverMap = new Map();
    }
    //init happend only when bind to page
    init(app) {
        console.log("message");
        super.init(app);
        // let headerLeft = document.getElementById("headerLeft");

        this.setMessage();
        this.registerEvent();

    }
    setMessage() {
        RemoteUtil.getJsonFromAPIServer(GLOBAL.API_SERVICE.NOTIF_USER_LIST + "/" + GLOBAL.NOTIFICATION_SENDER).then(json => {

            // let liItem = "";
            // if (json && json.receiverList ){
            //     this.receiverList = json.receiverList;
            //     for (let user of  json.receiverList){
            //         liItem += `<li class="border rounded px-2 mx-2" id='${user.uid}'>${user.displayName}<span>&times</span></li>`;
            //         this.receiverMap.set(user.uid,user.subscriptions);
            //     }
            // }
            // const listUl = document.querySelector(".receiver > ul");
            // listUl.innerHTML = liItem; 
            // const spanCloseList = listUl.querySelectorAll("span");
            // this.closeAction = this.closeAction.bind(this);
            // for (let span of spanCloseList){
            //     span.addEventListener("click",this.closeAction)
            // }

            let trData = "";
            if (json && json.receiverList) {
                for (let user of json.receiverList) {
                    trData += `<tr><td><input type="checkbox" id="${user.uid}"></td><td>${user.displayName || "Unknown"}</td><td>${user.email}</td>`;
                    this.receiverMap.set(user.uid, user);
                }
            }
            const table = document.querySelector("#tbl_receiver_list");
            table.innerHTML = trData;



        });
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
        document.querySelector("#b_choose").addEventListener("click", (evt) => {
            let selList = document.querySelectorAll("#tbl_receiver_list input:checked");
            if (selList) {
                let liItem = "";

                for (let item of selList) {
                    let user = this.receiverMap.get(item.id);
                    console.log(user);
                    liItem += `<li class="border rounded px-2 mx-2" id='${user.uid}'>${user.displayName}<span>&times</span></li>`;
                }
                const listUl = document.querySelector(".receiver > ul");
                listUl.innerHTML = liItem;
                const spanCloseList = listUl.querySelectorAll("span")   ;
                this.closeAction = this.closeAction.bind(this);
                for (let span of spanCloseList) {
                    span.addEventListener("click", this.closeAction)
                }

            }
        });
        document.querySelector("#b_submit").addEventListener("click", (evt) => {

            let receivers = document.querySelectorAll(".receiver li");
            let message = document.querySelector("#i_message").value;
            console.log("click", receivers.length);
            let endpointList = [];
            if (receivers && receivers.length > 0) {
                for (let receiver of receivers) {
                    let subscriptions = this.receiverMap.get(receiver.id).subscriptions;
                    if (subscriptions) {
                        for (let sub of subscriptions) {
                            endpointList.push(sub);
                        }
                    }
                }
            }
            let content = {
                "pushSubscription": "",
                "notificationMessage": message
            }
            let newList = [...new Set(endpointList)];

            for (let endPoint of newList) {
                content.pushSubscription = endPoint;
                console.log(JSON.stringify(content));
                RemoteUtil.sendJsonToAPIServer(GLOBAL.API_SERVICE.NOTIF_PUSH, content).then((json) => {
                    console.log(json);

                });
            }


        })
        //create button 
        // this.clickButtonAction = this.clickButtonAction.bind(this);

        //const btnNew = document.getElementById("b_new");

        // btnNew.addEventListener("click", this.clickButtonAction);
    }

    // clickButtonAction(e) {
    //     // console.log("click",e.target);

    //     this.app.route(GLOBAL.PAGE_NAME.TASK_NEW);
    // }
    clickNavItemAction(e) {
        console.log(e.target.id);
    }
    closeAction(e) {
        
        const li = e.target.parentNode;
        
        //uncheck from table
        let selList = document.querySelectorAll("#tbl_receiver_list input:checked");
            if (selList) {
                
                for (let item of selList) {
                    if (item.id == li.id){
                        item.checked = false ;
                    }
                }
            }
        
        //remove from li
        const ul = li.parentNode;
        ul.removeChild(li);
        
    }


}
export {
    MessageMainController
};