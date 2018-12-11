import GLOBAL from './constants.js';
import {
    AlertMessage
} from '../model/alert_msg.js';
import {
    RemoteUtil
} from '../util/util.js';

{
    'use strict';

    var config = {
        apiKey: "AIzaSyCnkh7giz51B9cSRdfjsFirT-3raFM5xb0",
        authDomain: "minotifservice.firebaseapp.com",
        databaseURL: "https://minotifservice.firebaseio.com",
        projectId: "minotifservice",
        storageBucket: "minotifservice.appspot.com",
        messagingSenderId: "108442257140"
    };
    firebase.initializeApp(config);

    var app = {
        showPage: "L", // can be L:Login , R: Register, F: forget passowrd
        registerInfo :null
    }

    var alertMsg = new AlertMessage();
    //let addressFinder = new AddressFinder(document.getElementById("i_address"));

    app.toggleDisplay = function () {
        let pageLogin = document.getElementById("page_login");
        let pageRegister = document.getElementById("page_register");

        if (app.showPage === "L") {
            pageLogin.classList.remove("d-none");
            pageRegister.classList.add("d-none");
        } else if (app.showPage === "R") {
            pageLogin.classList.add("d-none");
            pageRegister.classList.remove("d-none");
        }
    }
    app.listenAuthChange = function () {
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
                console.log("login done", user, email);

                // if (app.registerInfo){
                //     user.updateProfile({
                //         displayName: app.registerInfo.displayName                        
                //       }).then(function() {
                //         // Update successful.
                //         console.log("display updated")
                //         app.registerInfo = null;
                //       }).catch(function(error) {
                //         // An error happened.
                //         app.displayErrorMessage(error);
                //       });
                // }
                window.location.replace('./app.html');
                // if (app.registerInfo){ // if it is just after register, show login page again.
                //     document.querySelector("#i_username").value = app.registerInfo.email;
                //     document.querySelector("#i_password").value = app.registerInfo.password;
                //     app.registerInfo = null;
                // }else { //if it is normal login, go to main page
                //     window.location.replace('./app.html');
                // }
                
                // [START_EXCLUDE]

                // [END_EXCLUDE]
            } else {
                // User is signed out.
                // [START_EXCLUDE]

                // [END_EXCLUDE]
               
            }
            // [START_EXCLUDE silent]

            // [END_EXCLUDE]
        });
    }
    app.init = function () {
        app.listenAuthChange();
        const btnSubmit = document.getElementById("b_submit");
        btnSubmit.addEventListener("click", function (a) {
            console.log("click");
            let form = document.getElementById("f_login");
            if (form.checkValidity() === true) {
                app.doLogin();
            } else {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');

        });


        const linkRegister = document.getElementById("a_register");
        linkRegister.addEventListener("click", function (evt) {
            evt.preventDefault();
            app.showPage = "R";
            app.toggleDisplay();
        });
        const linkLogin = document.getElementById("a_login");
        linkLogin.addEventListener("click", function (evt) {
            evt.preventDefault();
            app.showPage = "L";
            app.toggleDisplay();
        });

        //register page
        const btnRegister = document.getElementById("b_register");
        btnRegister.addEventListener("click", function (a) {
            let form = document.getElementById("f_register");
            if (form.checkValidity() === true) {
                // loginPage.doLogin ();
                let firstName = document.querySelector('#i_firstname').value;
                let lastName = document.querySelector('#i_lastname').value;
                //let mobile = document.querySelector('#i_mobile').value ; 
                let email = document.querySelector('#i_email').value;
                let password = document.querySelector('#i_newpassword').value;

                let registerInfo = {
                    "displayName": firstName + " " + lastName,
                    "email": email,
                    "password": password
                };
                app.registerFirebase(registerInfo);
            } else {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');

        });
        app.toggleDisplay();

    }
    app.registerFirebase = function (registerInfo) {
        console.log("register here", registerInfo);
        app.registerInfo = registerInfo;
        firebase.auth().createUserWithEmailAndPassword(registerInfo.email, registerInfo.password)
            .then(function (newUserCred){
                if (newUserCred){
                                        
                    newUserCred.user.updateProfile({
                        displayName: app.registerInfo.displayName                        
                      }).then(function() {
                        // Update successful.
                        console.log("display updated")
                        // app.showPage = "L";
                        // app.toggleDisplay();
                        // const msg = {title:"Registered successfully",content:"user "+registerInfo.displayName + " has been registered, please login"};
                        // app.displaySuccessMessage(msg)
                        
                      }).catch(function(error) {
                        // An error happened.
                        app.displayErrorMessage(error);
                      });
                   
                }
            })
            .catch(function (error) {
                // Handle Errors here.
                app.displayErrorMessage(error);
                
                console.log(error);
            });
    }
    app.loginFirebase = function (loginInfo) {
        
        if (firebase.auth().currentUser) {
            // [START signout]
            //  firebase.auth().signOut();
            // [END signout]
            return true;
        } else {
            let email = loginInfo.userName;
            let password = loginInfo.pwd;
            // Sign in with email and pass.
            // [START authwithemail]
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
               app.displayErrorMessage(error);
                console.log(error);
                //document.getElementById('quickstart-sign-in').disabled = false;
                return false;
                // [END_EXCLUDE]
            });
            return true;
        }
    }
    app.doLogin = async function () {
        // const form = document.getElementById("f_login");
        // const formData = new FormData(form);
        const userName = document.getElementById("i_username").value;
        const password = document.getElementById("i_password").value;
        const rememberMe = document.getElementById("ch_remember");
        let alertInfo = document.getElementById("d_loginInfo");

        console.log(userName, password);
        alertMsg.clear();

        const loginInfo = {
            "userName": userName,
            "pwd": password,
            "role": "1" //tenant
        }
        // const isLogin = await RemoteUtil.login(loginInfo);


        const isLogin = app.loginFirebase(loginInfo);
        // console.log("response",content);
        if (isLogin) {
            if (rememberMe.checked) {
                localStorage.setItem("user", userName);
                localStorage.setItem("pwd", password);
            }

            // window.location.replace("../app.html");
        } else {
            //const md = document.getElementById("processing-modal");
            //$('#processing-modal').modal('hide');

            const msgContent = {
                "header": "Login Fail",
                "detail": "Recheck username/password"
            }
            if (!alertMsg.isShow()) {
                alertMsg.show(alertInfo, AlertMessage.ALERT_CATEGORY.ERROR, msgContent);
            } else {
                alertMsg.clear();
            }
        }

    }
    app.displayErrorMessage = function(error) {
        let alertInfo = document.getElementById("d_loginInfo");
        var errorCode = error.code;
        var errorMessage = error.message;
   
        const msgContent = {
            "header": errorCode,
            "detail": errorMessage
        }
        if (!alertMsg.isShow()) {
            alertMsg.show(alertInfo, AlertMessage.ALERT_CATEGORY.ERROR, msgContent);
        } else {
            alertMsg.clear();
        }
    }
    app.displaySuccessMessage = function(info) {
        let alertInfo = document.getElementById("d_loginInfo");
       
        const msgContent = {
            "header": info.title,
            "detail": info.content
        }
        if (!alertMsg.isShow()) {
            alertMsg.show(alertInfo, AlertMessage.ALERT_CATEGORY.SUCCESS, msgContent);
        } else {
            alertMsg.clear();
        }
    }

    app.init();


}