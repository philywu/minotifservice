let _alertCategory = {
    "WARNING": "alert-warning",
    "ERROR": "alert-danger",
    "SUCCESS": "alert-success",
    "INFO": "alert-primary",

}
class AlertMessage {

    constructor() {
        this.container = null;
        
    }
    static get ALERT_CATEGORY() {
        return _alertCategory;
    }
    isShow () {
        if (this.container) {
            if (this.container.children.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    }
    show(container, messageType, content) {
        //check if alert block is existing
        this.container = container;

        if (!this.isShow()) {
            container.appendChild(this.html(messageType, content))            
        }

    }
    clear() {

        
            if (this.isShow()) {
                let element = this.container;
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }                
            }
        
    }
    html(messageType, content) {
        if (content && content.detail == undefined) {
            content.detail = "";
        }
        let template = `<div class="alert alert-dismissible fade show text-left" role="alert">
        ${(content && content.header)?`<strong>${content.header}</strong><br>`:""}  ${content.detail}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
         </div>`;
        let doc = new DOMParser().parseFromString(template, 'text/html');
        let div = doc.body.firstChild;
        div.classList.add(messageType);
        return div;
    }
}
export {
    AlertMessage
}