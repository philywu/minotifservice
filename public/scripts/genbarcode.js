{
         
        var app = {
            scanner: null,
            scanTitle: document.querySelector("#h_scan_title"),
            searchBox:document.querySelector("#i_search_no"),
            searchButton:document.querySelector("#b_search"),
            scanButton: document.querySelector("#b_scan"),
            detailButton: document.querySelector("#b_detail"),
            currentJobDetailSectionTemplate: "",
        };
        app.init = function() {
            app.genbarcode();
        }
        app.genbarcode = function(){
            let arr = app.getJobIds();
            let list = document.querySelector("#barcode_list");

            for (let num of arr){
                let svg = `<div><svg id="barcode_${num}"></svg></div>`;
                list.innerHTML += svg;
                JsBarcode("#barcode_"+num, num, {
                    format: "CODE39",
                    width: 2,
                    height: 60,
                    displayValue: true
                  });
            }
            

        }

        app.getJobIds = function (){
            
            let arr = [];
            for (let i=0;i<20;i++){
                arr.push(""+(100000+i*10));
            }
            return arr; 
        }
        app.init();
}