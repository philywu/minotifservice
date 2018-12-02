import GLOBAL from '../scripts/constants.js';

import {NotificationMainController} from './NotificationMainController.js';
import {MessageMainController} from './MessageMainController.js';

const controllerClasses = {NotificationMainController,MessageMainController};
var controllerInstances = [];
class ControllerFactory {
    static getInstance(name) {
       
        const existInstance = controllerInstances.find(item =>{
            return (item.name == name); 
        })
    
        if (existInstance){
       //     console.log("existing");
            return existInstance.instance ; 
        } else {            
         //   console.log("new");
            const newInstance =  new controllerClasses[name];
            controllerInstances.push ({"name":name,instance:newInstance});
            return newInstance;
        }
        
       
        
    }
}

// class TaskNewController extends BaseController {
//     constructor(args) {
//         super(args);

//     }
//     //init happend only when bind to page
//     init(app) {
//         super.init(app);

//         this.BUTTON_TEXT_NEXT = 'Next <i class="fas fa-chevron-circle-right"></i>';
//         this.BUTTON_TEXT_CONFIRM = "Confirm";
//         //let headerLeft = document.getElementById("headerLeft");
//         //let navBar = document.getElementById("task_new_tabs");
//         // if (navBar){
//         //     let list = navBar.querySelectorAll("li > a");
//         //     for (let navItem of list){
//         //        navItem.addEventListener("click",this.clickNavItemAction)
//         //     }
//         // }
//         this.setInitValue();
//         this.registerEvent();
       


//     }
//     setInitValue() {
//         let addressFinder = new AddressFinder(document.getElementById("i_address"));
//         const pmSelect = document.getElementById("i_pm");
//         pmSelect.classList.add("disable");
//         RemoteUtil.getJsonFromAPIServer(GLOBAL.API_SERVICE.PMLIST).then(pmlist => {
//             if (pmlist) {
//                 let option = `<option value='0'>I don't know my PM</option>`;
//                 for (const pm of pmlist) {
//                     option += `
//                                 <option value='${pm.id}'>${pm.first_name} ${pm.last_name}</option>`;
//                 }
//                 pmSelect.innerHTML = option;
//             }
//         });
//     }
//     registerEvent() {
//         const btnNext = document.getElementById("b_next");
//         const btnPrev = document.getElementById("b_prev");
//         this.buttonNextClickAction = this.buttonNextClickAction.bind(this);
//         btnNext.addEventListener("click", this.buttonNextClickAction);

//         this.buttonPrevClickAction = this.buttonPrevClickAction.bind(this);
//         btnPrev.addEventListener("click", this.buttonPrevClickAction);

//         this.clickNavItemAction = this.clickNavItemAction.bind(this);
//         //nav bar
//         const navBar = document.getElementById("task_tabs");
//         if (navBar) {
//             let list = navBar.querySelectorAll("li > a");
//             for (let navItem of list) {
//                 navItem.addEventListener("click", this.clickNavItemAction)
//             }
//         }
//         //button camera
//         const btnCamera = document.getElementById("btn_camera");
//         this.buttonCameraClickAction = this.buttonCameraClickAction.bind(this);
//         btnCamera.addEventListener("click", this.buttonCameraClickAction);
        
//         // file browse
//         if (window.File && window.FileList && window.FileReader) {
//             document.getElementById('upload-photo').addEventListener("change", this.fileBrowseAction);
//         }
        

//     }
//     clickNavItemAction(e) {
//         let navList = document.querySelectorAll("#task_tabs .nav-item > a");
//         let nextActiveIndex = -1;
//         for (let [index, nav] of navList.entries()) {

//             if (nav === e.target) {
//                 nextActiveIndex = index;
//                 break;
//             }

//         }

//         let btn_prev = document.getElementById("b_prev");
//         let btn_next = document.getElementById("b_next");
//         if (nextActiveIndex == 0) { //select first
//             btn_prev.classList.add("d-none");
//         } else {
//             btn_prev.classList.remove("d-none");
//         }
//         if (nextActiveIndex == navList.length - 1) { //select last
//             this.displaySummary();
//             btn_next.innerHTML = this.BUTTON_TEXT_CONFIRM;
//         } else {
//             btn_next.innerHTML = this.BUTTON_TEXT_NEXT;

//         }

//     }
//     buttonPrevClickAction(e) {
//         console.log("prev Clicked");
//         let btn = e.target;

//         let navList = document.querySelectorAll("#task_tabs .nav-item > a");
//         //process Nav bar
//         let nextActiveIndex = -1;
//         for (let index of navList.keys()) {
//             let rIndex = navList.length - index - 1;
//             let nav = navList.item(rIndex);
//             if (rIndex < navList.length && rIndex > -1) {
//                 if (nav.classList.contains("active")) {
//                     nextActiveIndex = rIndex - 1; //make next nav active 
//                     nav.classList.remove("active");
//                 } else {
//                     if (nextActiveIndex == rIndex) {
//                         nav.classList.add("active");
//                         nav.classList.remove("disabled");
//                     }
//                 }
//             } else { //index = navList.length, the last element;
//                 //btn.value = "Confirm & Submit";
//             }
//             //process tab content ; 
//             if (nextActiveIndex >= 0 && nextActiveIndex < navList.length) {
//                 //clear first
//                 let paneList = document.querySelectorAll("#pills-tabContent .tab-pane");
//                 for (let pane of paneList) {
//                     pane.classList.remove("show");
//                     pane.classList.remove("active");

//                 }
//                 //add 
//                 paneList[nextActiveIndex].classList.add("show");
//                 paneList[nextActiveIndex].classList.add("active");
//             }
//             //hide/show previous button 
//             nextActiveIndex == 0 ? btn.classList.add("d-none") : btn.classList.remove("d-none");
//             // change text of next button
//             const btn_next = document.getElementById("b_next")
//             if (nextActiveIndex < navList.length - 1) {
//                 btn_next.innerHTML = this.BUTTON_TEXT_NEXT;
//             }
//         }


//     }
//     buttonNextClickAction(e) {
//         //console.log("next Clicked");
//         //let btn = e.target;
//         const btn_prev = document.getElementById("b_prev")
//         const btn_next = document.getElementById("b_next")
//         if (btn_next.innerHTML === this.BUTTON_TEXT_CONFIRM) {
//             this.creatNewTask();
//             return;
//         }
//         let navList = document.querySelectorAll("#task_tabs .nav-item > a");
//         //process Nav bar
//         let nextActiveIndex = -1;
//         for (let [index, nav] of navList.entries()) {

//             if (index < navList.length) {
//                 if (nav.classList.contains("active")) {
//                     nextActiveIndex = index + 1; //make next nav active 
//                     nav.classList.remove("active");
//                 } else {
//                     if (nextActiveIndex == index) {
//                         nav.classList.add("active");
//                         nav.classList.remove("disabled");
//                     }
//                 }
//             } else { //index = navList.length, the last element;
//                 //btn.value = "Confirm & Submit";
//             }
//         }
//         //process tab content ; 
//         if (nextActiveIndex >= 0 && nextActiveIndex < navList.length) {
//             //clear first
//             let paneList = document.querySelectorAll("#pills-tabContent .tab-pane");
//             for (let pane of paneList) {
//                 pane.classList.remove("show");
//                 pane.classList.remove("active");

//             }
//             //add 
//             paneList[nextActiveIndex].classList.add("show");
//             paneList[nextActiveIndex].classList.add("active");
//         }
//         //show hide previous button
        

//         nextActiveIndex > 0 ? btn_prev.classList.remove("d-none") : "" //btn.classList.remove("d-none");

//         // change text of next button
//         if (nextActiveIndex == navList.length - 1) {
//             this.displaySummary();
//             btn_next.innerHTML = this.BUTTON_TEXT_CONFIRM;
//         } else {
//             btn_next.innerHTML = this.BUTTON_TEXT_NEXT;
//         }
//     }
//     buttonCameraClickAction(event){
//         console.log("click camera button");
//         let overlay = document.getElementById('overlay');
//         let cameraPane = document.getElementById('camera-pane');
//         let output = document.getElementById("result");
//         let camera = Camera.getInstance();
//         camera.init(cameraPane,output,overlay);
//         overlay.classList.remove("d-none");


//     }
//     fileBrowseAction(event) {

//         console.log(event.target.files);
//         let files = event.target.files;
//         let output = document.getElementById("result");


//         for (let file of files) {
//             if (file.type.match('image.*')) {

//                 let picReader = new FileReader();

//                 picReader.addEventListener("load", function (event) {
//                     let picFile = event.target;

//                     let div = document.createElement("div");
//                     div.className = 'image-container';
//                     div.setAttribute('name', file.name);

//                     let img = document.createElement("img");
//                     img.className = "thumbnail";
//                     img.src = window.URL.createObjectURL(file);
//                     img.height = 60;
//                     img.onload = function () {
//                         window.URL.revokeObjectURL(this.src);
//                     }
//                     div.appendChild(img);
//                     let ico = document.createElement("i");
//                     ico.innerText = 'X';
//                     ico.className = 'material-icons';

//                     ico.addEventListener("click", function () {
//                         let uploadForm = document.getElementById("f_upload");
//                         let imgDiv = this.parentElement;
//                         let files = document.getElementById('upload-photo').files;
//                         let removedFileName = imgDiv.getAttribute("name");
//                         for (let file of files) {
//                             if (removedFileName && file.name.includes(removedFileName)) {
//                                 console.log(file);
//                                 // uploadForm.reset();

//                             }


//                         }
//                         imgDiv.remove();
//                     });




//                     div.appendChild(ico);
//                     //clear existing picutures, only upload one
//                     Util.clearChildNodes(output);
//                     output.insertBefore(div, null);

//                 });
//                 picReader.readAsDataURL(file);
//             } else {
//                 // not an image
//             }
//         }

//     }
//     displaySummary(){
//         document.getElementById("sum_header").innerHTML=document.getElementById("i_subject").value;
//         document.getElementById("sum_detail").innerHTML=document.getElementById("i_detail").value;
//         document.getElementById("sum_address").innerHTML=document.getElementById("i_address").value;
//         const selPm = document.getElementById("i_pm");
//         document.getElementById("sum_pm").innerHTML=selPm.options[selPm.selectedIndex].text;
//         document.getElementById("sum_name").innerHTML= sessionStorage.getItem("userName");
//         document.getElementById("sum_email").innerHTML= sessionStorage.getItem("userEmail");
//     }
//     async creatNewTask() {
//         console.log("create new task");
//         const address=document.getElementById("i_address").value;
//         const dpid="123";
//         const selPm = document.getElementById("i_pm");
//         const pmId=selPm.options[selPm.selectedIndex].value;
//         const subject=document.getElementById("i_subject").value;

//         const details=document.getElementById("i_detail").value;
//         const requesterId = sessionStorage.getItem("userId");
        
//         //this.app.route("tenant_main");
//         const postBody = {
//             "property_address":address, //tenant 
//             "property_dpid":dpid,
//             "task_header":subject,
//             "task_details":details,
//             "requesterId":requesterId,
//             "responserId":pmId,
//             "categoryId":"",
//             "newnote":""
//         };
//         const responseJson = await RemoteUtil.postJsonToAPIServer(GLOBAL.API_SERVICE.TASK,postBody);
//         // const createURL = GLOBAL.API_URL+"/"+GLOBAL.API_SERVICE.TASK;
//         // const rawResponse = await fetch(createURL, {
//         //     method: 'POST',
//         //     headers: {
//         //         'Accept': 'application/json',
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body:JSON.stringify()
//         // });
//         // const content = await rawResponse.json();
//         console.log("response",responseJson);
//         if (responseJson.status =="success"){
//             this.app.route(GLOBAL.PAGE_NAME.TENANT_MAIN);
//         }
//     }
//     async getTasksFromServer(property) {
//         const url = Util.getFullServerURL(GLOBAL.API_SERVICE.TASK);
//         try {
//             let res = await fetch(url);
//             return res.json();
//         } catch (err) {
//             return null;
//         }


//     }


// }


export {
    ControllerFactory,
}