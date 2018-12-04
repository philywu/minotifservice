import GLOBAL from '../scripts/constants.js';
import {BaseController} from "./BaseController.js";

class BarcodeController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        console.log("barcode");
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
  
    

    

}
export {BarcodeController};