import GLOBAL from '../scripts/constants.js';
import {BaseController} from "./BaseController.js";
import {
    start
} from "../util/print.js"
class BarcodeController extends BaseController {
    constructor(args) {
        super(args);
        this.direction="landscape";

    }
    //init happend only when bind to page
    init(app) {
        console.log("barcode");
        super.init(app);
        // let headerLeft = document.getElementById("headerLeft");
       
        this.registerEvent();
        this.barcodeList = this.getBarcodeList(24);
        
        
    }

    getBarcodeList(num){
        let arr = [];
        for (let i=0;i<num;i++){
            arr.push(""+(10000000+i*10));
        }
        return arr; 
    }
  
    registerEvent() {
        this.showPrintContent = this.showPrintContent.bind(this);
        $('#myModal').on('show.bs.modal', this.showPrintContent);

        //bind this
        
        //nav bar
        // const navBar = document.getElementById("task_tabs");
        // if (navBar) {
        //     let list = navBar.querySelectorAll("li > a");
        //     for (let navItem of list) {
        //         navItem.addEventListener("click", this.clickNavItemAction)
        //     }
        // }

        // document.querySelector("#b_submit").addEventListener("click", (evt) =>{
        //     console.log ("click");
        // })
        //create button 
        // this.clickButtonAction = this.clickButtonAction.bind(this);

        //const btnNew = document.getElementById("b_new");

       // btnNew.addEventListener("click", this.clickButtonAction);

       document.querySelector("#b_back").addEventListener("click",evt =>{   
        
        $('#myModal').modal('hide');
        let printDiv = document.querySelector("#printdiv");
        printDiv.innerHTML = "";
        });

       document.querySelector("#b_print").addEventListener("click",evt =>{    
        let svgDiv = document.querySelector("#printdiv_svg")    ;
        let printDiv = document.querySelector("#printdiv")    ;
        const options = {
            type: 'html',
            printable: "printdiv_svg",
            direction:this.direction,
            paper_height:this.paper_height,
            font_size: '12pt',
            honorMarginPadding: true,
            honorColor: false,
            properties: null,
            frameId: 'printJS',
            border: true,
            htmlData: ''
        };
        svgDiv.innerHTML = printDiv.innerHTML;
        let svgs = svgDiv.querySelectorAll('.bc-svg');
        for (let svg of svgs ){
            if (this.direction == GLOBAL.PRINT_OPTION.PORTRAIT.direction){

                //svg.setAttribute("viewBox","65 30 145 80");
                svg.setAttribute("viewBox","0 28 145 80");
            } else {
                svg.setAttribute("viewBox","0 0 100 100");
            }
        }
       // svg.setAttribute("viewBox","-25 46 145 62")
        start (options);
    });

    
    }

    async showPrintContent(event) {
        
        const reportName = event.relatedTarget.value; 
        let printDiv = document.querySelector("#printdiv");
        let printPage = document.querySelector("#printpage");
        let printFont = document.querySelector("#printfont");

        let selLabel = document.querySelector("#i_label");

        let selArr = selLabel.value.split("");
        let direction = selArr[0];
        let row = selArr[2];
        let col = selArr[1];
        if (direction.toUpperCase() == "P") {
            this.direction = GLOBAL.PRINT_OPTION.PORTRAIT.direction
            this.paper_height = GLOBAL.PRINT_OPTION.PORTRAIT.paper_height;
             
            printPage.classList.remove("landscape");
            printPage.classList.add("portrait");
            

        } else {
            this.direction = GLOBAL.PRINT_OPTION.LANDSCAPE.direction
            this.paper_height = GLOBAL.PRINT_OPTION.LANDSCAPE.paper_height;
            
            printPage.classList.remove("portrait");
            printPage.classList.add("landscape");
            
        }

         //let html = await this.app.page.getPrintFile(reportName);
         let html = this.gentable(printDiv,col,row);
         

        //   let box = document.querySelector(".labelbox");
        //   box.classList.remove("labelbox");
        //   box.classList.add("labelbox");  
    
}
gentable (printDiv,col,row){
    
    let content = "";
    
    for (let i=0;i<row;i++){
        let trContent = "<tr>";
        for (let j=0;j<col ; j++){            
            trContent += `<td ><svg class="bc-svg" id="bc_${i*col+j}"></svg></td>`;
        }
        trContent += "</tr>";
        content +=trContent;
    }
    let html =  `<table>${content}</table>`;
    printDiv.innerHTML = '<div id="print-barcode">'+html+'</div>';
    let svgs = document.querySelectorAll('.bc-svg');
    for (let svg of svgs ){
        const id = svg.id; 
        let seq = Number.parseInt(id.split("_")[1]);
       // console.log(id);
        JsBarcode('#'+id, this.barcodeList[seq], {
            format: "CODE128",
            width: 2,
            height: 80,
            fontSize:16,
            displayValue: true
          });
        //console.log(svg.viewBox);
       
    }
   
}
genBarcodeImg(){

    let svg = `<div><svg id="barcode_${num}"></svg></div>`;
    list.innerHTML += svg;
    
        
}


    

}
export {BarcodeController};