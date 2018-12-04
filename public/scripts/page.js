import {ControllerFactory} from "../controller/controller.js";

var _CONFIG_FILE_PATH = "../config/config.json";
var _FRAGMENT_FILE_EXT = ".fragment.html";
var _PRINT_FILE_EXT = ".print.html";
var _VIEW_FILE_PATH = "../view/";

const _FETCH_ARGS = {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  }

class Page {
    constructor () {
        // let config;
        // Config.build().then(res => {
        //     config=res;
        //     console.log(res);
        // });
       //this.config = new Config() ; 
        this.currentPageConfig = {};
        this.historyPageConfigStack = [];

        this.config = null;
        
    }
    
    getPageConfig(pageName) {
        if (this.config){
            const pages = this.config.pages;
            let pageConfig = pages.filter(el => {                
                return (el.name == pageName)
                });
        
            pageConfig[0].controllerInstance = ControllerFactory.getInstance(pageConfig[0].controller);
            this.currentPageConfig = pageConfig[0] ; 
            return pageConfig[0];
        } 
    }
    historyPush(pageConfig){
        this.historyPageConfigStack.push(pageConfig);
    }
    historyPop(){
        if (this.historyPageConfigStack.length>0){
            return this.historyPageConfigStack.pop();
        } else {
            return this.currentPageConfig;
        }
    }
    
    async load(pageName) {             
        // this.config.load(function(configuration,thisObj){
        //    // matchConfig(configuration);
        //     console.log(configuration,thisObj.pageName);

        //     const pages = configuration.pages;

        //     let page = pages.filter(el => {                
        //         return (el.name == thisObj.pageName)
        //         });
        //     console.log(page);

        // },this);
        
        this.config = await this.getConfigFromJson();
        return this.getPageConfig(pageName);

    }
    
    async getFragmentFile(viewName){
        const fileName = _VIEW_FILE_PATH+viewName+_FRAGMENT_FILE_EXT; 
       
        try {
            let res = await fetch(fileName,_FETCH_ARGS);
            return res.text();
        } catch(err) {
            return null; 
        }
    }
    async getPrintFile(viewName){
        const fileName = _VIEW_FILE_PATH+viewName+_PRINT_FILE_EXT; 
       
        try {
            let res = await fetch(fileName,_FETCH_ARGS);
            return res.text();
        } catch(err) {
            return null; 
        }
    }
    async getConfigFromJson() {
        if (!this.config) {
            try {
                let res = await fetch(_CONFIG_FILE_PATH,_FETCH_ARGS);
                return res.json();
            } catch(err) {
                console.log(err);
                return null; 
            }
        } else {
            return this.config;
        }
        
    }
   
}

export {Page}
