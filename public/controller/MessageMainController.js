import GLOBAL from '../scripts/constants.js';
import {BaseController} from "./BaseController.js";

class MessageMainController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        console.log("message");
        super.init(app);
        // let headerLeft = document.getElementById("headerLeft");
       
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

        document.querySelector("#b_submit").addEventListener("click", (evt) =>{
            console.log ("click");
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


}
export {MessageMainController};