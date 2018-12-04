import GLOBAL from '../scripts/constants.js';
import {BaseController} from "./BaseController.js";
import {
    RemoteUtil
} from "../util/util.js";
import {
    start
} from "../util/print.js"
const NOTIFICATION_SENDER1 = "hitools"
class NotificationMainController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        console.log("notification");
        super.init(app);
        // let headerLeft = document.getElementById("headerLeft");
        
        this.setNotification();
        this.registerEvent();
    }
    setNotification() {
        const uid = this.app.user.uid;
        const chkAllow1 = document.querySelector("#i_allow_hightools")
        RemoteUtil.getJsonFromAPIServer(GLOBAL.API_SERVICE.NOTIF_PROFILE+"/"+NOTIFICATION_SENDER1+"/"+uid).then( json =>{
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
           messageSender:NOTIFICATION_SENDER1,
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
       
    })
       
       
    }

    genTabData(navItem,json,status){
        //set count information
        if (json.count){
          //  const num = json.count[status];
            let countList = json.count;
            let nums = countList.filter(function (j){
                return j.status_id === status; 
            })
            let num = 0 ; 
            if (nums.length>0){
                num = nums[0].count;
            }
            if (num>0){
                navItem.querySelector("span").innerHTML = `(${num})`;
            }
        }
        //set card data 
        let pmCardList = document.getElementById(navItem.getAttribute("aria-controls"))
                            .querySelector(".pm-card-list");
         if (json.result && json.result.length>0 && pmCardList){
            let cardList = json.result.filter(function (task) {
                return task.status_id === status;
            })
            if (cardList && cardList.length>0){
                pmCardList.innerHTML = this.generateCardList(cardList,status);
                this.registerEventCard(pmCardList);
            }
        }
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

        let chk = document.querySelector('#i_allow_hightools');
        this.actionSetNotification = this.actionSetNotification.bind(this);
        chk.addEventListener("change", this.actionSetNotification);
        //create button 
        // this.clickButtonAction = this.clickButtonAction.bind(this);

        //const btnNew = document.getElementById("b_new");

     //  btnNew.addEventListener("click", this.clickButtonAction);
       document.querySelector("#toMessage").addEventListener("click",evt =>{
           console.log("click");
           this.app.route("message_main");
       });
       this.showPrintContent = this.showPrintContent.bind(this);
       $('#myModal').on('show.bs.modal',this.showPrintContent);

       document.querySelector("#b_print").addEventListener("click",evt =>{        
        const options = {
            printable: "printdiv",
            type: 'html',
            header: null,
            maxWidth: '50em',
            direction:"landscape",
            font: 'TimesNewRoman',
            font_size: '12pt',
            honorMarginPadding: true,
            honorColor: false,
            properties: null,
            frameId: 'printJS',
            border: true,
            htmlData: ''
        };
        start (options);
    });


    document.querySelector("#b_back").addEventListener("click",evt =>{   
        
        $('#myModal').modal('hide');
        let printDiv = document.querySelector("#printdiv");
        printDiv.innerHTML = "";
    });
}

    async showPrintContent(event) {
        
            // var button = $(event.relatedTarget) // Button that triggered the modal
             //var recipient = button.data('whatever') // Extract info from data-* attributes
            const reportName = event.relatedTarget.value; 
             let printDiv = document.querySelector("#printdiv");
            console.log(this.app.page);
              let html = await this.app.page.getPrintFile(reportName);
              printDiv.innerHTML = html;
        
    }
    registerEventCard(cardListDiv) {
        let app = this.app; 
        let cards = cardListDiv.querySelectorAll(".card");
        for (let card of cards ){
            card.addEventListener("click",function(){
                console.log("ID",card.id);
                app.route(GLOBAL.PAGE_NAME.TASK_DETAIL,{"task_id":card.id})

            })
        }
    }
    // clickButtonAction(e) {
    //     // console.log("click",e.target);

    //     this.app.route(GLOBAL.PAGE_NAME.TASK_NEW);
    // }
    clickNavItemAction(e) {
        console.log(e.target.id);
    }

    generateCardList(cardList,status) {
        let cardHTML = ""
        let currentPM = sessionStorage.getItem("userId");
        if (currentPM){
            currentPM = Number.parseInt(currentPM);
        }
        if (cardList && cardList.length>0) {
            if (status===1){
                cardList.sort(function(a,b){
                    if (a.pm_id === currentPM && b.pm_id!==currentPM){
                        return -1;
                    } else if ((a.pm_id !== currentPM && b.pm_id===currentPM)){
                        return 1;
                    } else if  ((a.pm_id !== currentPM && b.pm_id!==currentPM)){
                        if (a.pm_id && !b.pm_id){
                            return 1;
                        }
                    } else {
                        return 0; 
                    }
                })
            }
            for (let card of cardList) {
                if (status ===1){
                    cardHTML += this.generateCardStatusNew(card,currentPM);
                } else {
                    cardHTML += this.generateCard(card);
                }
            }
        }
        return cardHTML;
    }
    generateCard(card) {
        if (card) {
            // for (let key in card){
            //     console.log(card[key]);
            // }
            //Util.setDefaultValue(card, ["title", "status", "date", "priority"]);
            // console.log(card);
            return `<div class="card" id="${card.task_id}">       
            <div class="priority ${card.priority=="1"?"bg-warning":''}"></div>
                <div class="card-body">                                
                <h6 class="card-title">${card.task_header}</h6>
                <div class="card-text text-secondary">${card.full_address}</div>     
                <div class="card-text text-danger">${card.sub_status_text}</div>                      
                </div>                                       
            </div>
            `;
        }

    }
    generateCardStatusNew(card,currentPM) {
        if (card) {
            // for (let key in card){
            //     console.log(card[key]);
            // }
            //Util.setDefaultValue(card, ["title", "status", "date", "priority"]);
            // console.log(card);
            let pmName = "Unassigned";
            let colorClass = "";

            if (card.pm_id){
                pmName = card.pm_first_name + " "+ card.pm_last_name;
                if (currentPM==card.pm_id){
                    colorClass = "bg-danger";
                }
            } else {
                colorClass = "bg-warning";
            }
            return `<div class="card" id="${card.task_id}">       
            <div class="priority ${colorClass}"></div>
                <div class="card-body">                                
                <h6 class="card-title">${card.task_header}</h6>
                <div class="card-text text-secondary">${card.full_address}</div>     
                <div class="card-text text-danger">${pmName}</div>                      
                </div>                                       
            </div>
            `;
        }

    }

}
export {NotificationMainController};