import { Page } from "./page.js";
import GLOBAL from "./constants.js";
import {
    Util
} from "../util/util.js";
{
    var app = {
        applicationServerPublicKey :'BAsuPEw0FQi_q640-9X9MXG8Q9exjoD2AilWBskvFTNYxbJxE8ZEHTPYg3lQWDkY0Ql0oKAFI2ULMGQp50gKaEM',

        page : new Page()
    };
    // check service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            app.swRegistration = registration;
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      }

    var config = {
        apiKey: "AIzaSyCnkh7giz51B9cSRdfjsFirT-3raFM5xb0",
        authDomain: "minotifservice.firebaseapp.com",
        databaseURL: "https://minotifservice.firebaseio.com",
        projectId: "minotifservice",
        storageBucket: "minotifservice.appspot.com",
        messagingSenderId: "108442257140"
    };
    firebase.initializeApp(config);
    //let page = new Page();

    app.init = function(pageName){
        
        const aMenu = document.querySelector("#a_menu");        
        aMenu.addEventListener("click",app.signout);

        app.checkSignin(pageName);

       
    }
    app.signout = function(evt){
        console.log("sign out here");
        firebase.auth().signOut();
    }

    app.subscribeUser = async function() {
        const applicationServerKey = Util.urlB64ToUint8Array(app.applicationServerPublicKey);
        if (app.swRegistration){
            let subscription = await app.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
                });
            return subscription;
                
        } else {
            return null;
        }
      }
    app.checkSignin = function (pageName) {
        firebase.auth().onAuthStateChanged(function (user) {
            // [START_EXCLUDE silent]
            // [END_EXCLUDE]
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                console.log("logined", user, email);
                app.user = {
                    uid:user.uid,
                    displayName: user.displayName,
                    email :user.email
                }
                // [START_EXCLUDE]
                app.page.load(pageName).then(pageConfig => {
            
                    app.render(pageConfig);
                });    
                // [END_EXCLUDE]
            } else {
                // User is signed out.
                // [START_EXCLUDE]
                window.location.replace('./login.html');
                // [END_EXCLUDE]
            }
            // [START_EXCLUDE silent]

            // [END_EXCLUDE]
        });
    }

    app.route = function(pageName,param){
        if (app.page.config){
           
            app.page.historyPush(app.page.currentPageConfig);
            let pageConfig = app.page.getPageConfig(pageName);
            app.render(pageConfig,param);

        } else {
            app.init(pageName); 
        }
    }
    app.render = function(config,param){
        //set current page 
        //header
        if(config){
             app.renderHeader(config.header);
             app.renderMain(config,param);
        }
    }
    app.renderHeader= function(headerConfig){
        let header = document.getElementById("pageHeader");
        let title = header.getElementsByTagName("h4")[0];
        title.innerHTML = headerConfig.title;
        let headerLeft = document.getElementById("headerLeft");
        let leftIcon ;
        if (headerConfig.isHome){
            leftIcon = "fa-home";
        }
        if (headerConfig.isBack){
            leftIcon = "fa-chevron-left";
            headerLeft.addEventListener("click",app.back);
        }
        headerLeft.innerHTML = `<i class="fas ${leftIcon} pl-1 pr-1"></i>`;
        
    }
    app.renderMain = async function(config,param){
        let mainDiv = document.getElementsByClassName("main")[0];
        let html = await this.page.getFragmentFile(config.name);
        mainDiv.innerHTML = html;
        app.setupController(config,param);
        // let t =  document.getElementById("tenant");
        // console.log("tenant",t);
       // this.page.getFragmentFile()
    }
    app.setupController =  function(config,param){
        if (config.controllerInstance){
            config.controllerInstance.init(app,param);
        }
    }
    app.back = function (e){
        console.log("back");
        let pageConfig = app.page.historyPop();
        app.page.currentPageConfig = pageConfig;
        app.render(pageConfig);
    }

    app.init(GLOBAL.PAGE_NAME.NOTIFICATION_MAIN);
    // if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', function() {
    //       navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    //         // Registration was successful
    //         console.log('ServiceWorker registration successful with scope: ', registration.scope);
    //       }, function(err) {
    //         // registration failed :(
    //         console.log('ServiceWorker registration failed: ', err);
    //       });
    //     });
    //   }

}