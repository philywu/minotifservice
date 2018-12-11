export default {
    //API_URL: "http://192.168.1.6:8000/api",    
   // API_URL: "http://localhost:8000/api",    
    //API_URL: "http://219.88.233.164:4000/api",
    //API_URL: "https://test.micontec.co.nz/api",
    //API_URL: "https://minotifservice.firebaseio.com/api",    
    API_URL: "https://us-central1-minotifservice.cloudfunctions.net/app/api",    
    API_SERVICE : {
        NOTIF_SETTING: "notification-setting",
        NOTIF_PROFILE: "notification-profile",
        NOTIF_USER_LIST: "notification-userlist",
        NOTIF_PUSH: "push",
        COMMENTS:"comments",
    },
    PAGE_NAME:{
        "NOTIFICATION_MAIN":"notif_main",
        "PM_MAIN":"pm_main",
        "TASK_DETAIL":"task_detail",
        "MESSAGE_CLIENT":"message_client",
        "MESSAGE_MAIN":"message_main"
    },
    NOTIFICATION_SENDER : "hitools",
    PRINT_OPTION:{
        LANDSCAPE:{
            direction:"landscape",
            paper_height: "209mm",
        },
        PORTRAIT : {
            direction:"portrait",
            paper_height: "371mm",
        }
        
    }
    
}
