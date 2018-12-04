const PRINT_TYPES = ['pdf', 'html', 'image', 'json'];

const DEFAULT_OPTIONS = {
    printable: null,
    type: 'html',
    header: null,
    maxWidth: '297mm',//800,
    direction:"portrait",
    font: 'TimesNewRoman',
    font_size: '12pt',
    honorMarginPadding: true,
    honorColor: false,
    properties: null,
    frameId: 'printJS',
    border: true,
    htmlData: ''
};

// print friendly defaults
const PRINT_FRIENDLY_ELEMENT = '' + 'max-width: ' + DEFAULT_OPTIONS.maxWidth +' !important;' + DEFAULT_OPTIONS.font_size + ' !important;'; //'px !important;' + DEFAULT_OPTIONS.font_size + ' !important;';
const BODY_STYLE = 'font-family:' + DEFAULT_OPTIONS.font + ' !important; font-size: ' + DEFAULT_OPTIONS.font_size + ' !important; width:100%;';
const HEADER_STYLE = 'font-weight:300;';

/**
 * @param {Options} options
 * @returns {Promise}
 */
export function start (options=DEFAULT_OPTIONS) {
    const print = new Print(options);
    switch (options.type) {
        case 'pdf':
            return print.pdf();
        case 'image':
            return print.image();
        case 'html':
            return print.html();
        case 'json':
            return print.json();
    }
    throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
}

// printJS class
export class Print {
    /**
     * @param {Object} options
     */
    constructor (options=DEFAULT_OPTIONS) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        };

        // some validation
        this.validateInput();

        // to prevent duplication and issues, remove this.printFrame from DOM, if it exists
        let usedFrame = document.getElementById(this.options.frameId);

        if (usedFrame) {
            usedFrame.parentNode.removeChild(usedFrame);
        }

        // create a new iframe or embed element (IE prints blank pdf's if we use iframe)
        if (isIE() && this.options.type === 'pdf') {
            // create embed element
            this.printFrame = document.createElement('embed');
            this.printFrame.setAttribute('type', 'application/pdf');

            // hide embed
            this.printFrame.setAttribute('style', 'width:0px;height:0px;');
        } else {
            // create iframe element
            this.printFrame = document.createElement('iframe');

            // hide iframe
            this.printFrame.setAttribute('style', 'display:none;');
        }

        // set element id
        this.printFrame.setAttribute('id', this.options.frameId);

        // for non pdf printing, pass empty html document to srcdoc (force onload callback)
        if (this.options.type !== 'pdf') {       
            const style =  `<style>@media print{@page {size: ${this.options.direction}}}</style>`;
            this.printFrame.srcdoc = `<html><head><link rel="stylesheet" href="./styles/index.css"><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">${style} </head><body></body></html>`;
        }
    }

    /**
     *
     */
    pdf () {
        if (isFirefox()) {
            return new Promise((resolve) => {
                console.warn('PrintJS doesn\'t support PDF printing in Firefox.');
                let win = window.open(this.options.printable, '_blank');
                win.focus();
                resolve();
            });
        }
        // if showing feedback to user, pre load pdf files (hacky)
        // since we will be using promises, we can't use this feature in IE
        if (!isIE()) {
            return new Promise((resolve) => {
                let pdfObject = document.createElement('img');
                pdfObject.src = this.options.printable;
                const loadInterval = setInterval(() => {
                    if (pdfObject.complete) {
                        window.clearInterval(loadInterval);
                        this.printFrame.setAttribute('src', this.options.printable);
                        this.print().then(resolve);
                    }
                }, 100);
            });
        }
        this.printFrame.setAttribute('src', this.options.printable);
        return this.print();
    }

    /**
     *
     */
    image () {
        function printImage () {
            // create wrapper
            let printableElement = document.createElement('div');
            printableElement.setAttribute('style', 'width:100%');
            // to prevent firefox from not loading images within iframe, we can use base64-encoded data URL of images pixel data
            if (isFirefox()) {
                // let's make firefox happy
                let canvas = document.createElement('canvas');
                canvas.setAttribute('width', img.width);
                canvas.setAttribute('height', img.height);
                let context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);

                // reset img src attribute with canvas dataURL
                img.setAttribute('src', canvas.toDataURL('JPEG', 1.0));
            }
            printableElement.appendChild(img);
            // add header if any
            if (this.options.header) {
                this.addHeader(printableElement);
            }
            // store html data
            this.options.htmlData = printableElement.outerHTML;
            // print image
            return this.print();
        }
        let img = document.createElement('img');
        img.setAttribute('style', 'width:100%;');
        img.src = this.options.printable;
        if (!isIE()) {
            let loadImage = new Promise((resolve) => {
                let loadPrintableImg = setInterval(checkImgLoad, 100);

                function checkImgLoad () {
                    if (img.complete) {
                        window.clearInterval(loadPrintableImg);
                        resolve('PrintJS: Image loaded. Read to this.');
                    }
                }
            });
            loadImage.then((result) => {
                console.log(result);
                printImage();
            });
            return new Promise((resolve) => {
                let pdfObject = document.createElement('img');
                pdfObject.src = this.options.printable;
                const loadInterval = setInterval(() => {
                    if (pdfObject.complete) {
                        window.clearInterval(loadInterval);
                        printImage().then(resolve);
                    }
                }, 100);
            });
        }
        return printImage();
    }

    /**
     * @returns {boolean}
     */
    html () {
        // get HTML printable element
        let printElement = document.getElementById(this.options.printable);
        // check if element exists
        if (!printElement) {
            window.console.error('Invalid HTML element id: ' + this.options.printable);
            return false;
        }
        // make a copy of the printElement to prevent DOM changes
        let printableElement = document.createElement('div');
        printableElement.appendChild(printElement.cloneNode(true));
        // add cloned element to DOM, to have DOM element methods available. It will also be easier to colect styles
        printableElement.setAttribute('style', 'display:none;');
        printableElement.setAttribute('id', 'printJS-html');
        printElement.parentNode.appendChild(printableElement);
        // update printableElement variable with newly created DOM element
        printableElement = document.getElementById('printJS-html');
        // get main element styling
        printableElement.setAttribute('style', this.collectStyles(printableElement) + 'margin:0 !important;');
        // get all children elements
        let elements = printableElement.children;
        // get styles for all children elements
        this.loopNodesCollectStyles(elements);
        // add header if any
        if (this.options.header) {
            this.addHeader(printableElement);
        }
        // remove DOM printableElement
        printableElement.parentNode.removeChild(printableElement);
        // store html data
        this.options.htmlData = addWrapper(printableElement.innerHTML);
        // print html element contents
        return this.print();
    }

    /**
     *
     */
    json () {
        // check if we received proper data
        if (typeof this.options.printable !== 'object') {
            throw new Error('Invalid javascript data object (JSON).');
        }
        // check if properties were provided
        if (!this.options.properties || typeof this.options.properties !== 'object') {
            throw new Error('Invalid properties array for your JSON data.');
        }
        // variable to hold html string
        let htmlData = '';
        // check print has header
        if (this.options.header) {
            htmlData += '<h1 style="' + HEADER_STYLE + '">' + this.options.header + '</h1>';
        }
        // function to build html templates for json data
        htmlData += this.jsonToHTML();
        // store html data
        this.options.htmlData = addWrapper(htmlData);
        // print json data
        this.print();
    }

    /**
     *
     */
    print () {
        return new Promise((resolve) => {
            function finishPrint() {
                // print iframe document
                printJS.focus();
                // if IE, try catch with execCommand
                if (isIE() && this.options.type !== 'pdf') {
                    try {
                        printJS.contentWindow.document.execCommand('print', false, null);
                    } catch (e) {
                        printJS.contentWindow.print();
                    }
                } else {
                    printJS.contentWindow.print();
                }
                resolve();
            }
            function finishPrintPdfIe() {
                // wait until pdf is ready to print
                if (typeof printJS.print === 'undefined') {
                    setTimeout(() => {
                        finishPrintPdfIe()
                    }, 1000);
                } else {
                    printJS.print();
                    // remove embed (just because it isn't 100% hidden when using h/w = 0)
                    setTimeout(() => {
                        printJS.parentNode.removeChild(printJS)
                    }, 2000);
                }
            }
            // append iframe element to document body
            document.getElementsByTagName('body')[0].appendChild(this.printFrame);
            // get iframe element
            let printJS = document.getElementById(this.options.frameId);
            
            // if printing pdf in IE
            if (isIE() && this.options.type === 'pdf') {
                finishPrintPdfIe();
            } else {
                // wait for iframe to load all content
                this.printFrame.onload = () => {
                    if (this.options.type === 'pdf') {
                        finishPrint();
                    } else {
                        // get iframe element document
                        let printDocument = (printJS.contentWindow || printJS.contentDocument);
                        if (printDocument.document) printDocument = printDocument.document;

                        // inject printable html into iframe body
                        printDocument.body.innerHTML = this.options.htmlData;
                        console.log(printDocument);
                        finishPrint();
                    }
                }
            }
        });
    }

    /**
     * @param {Element} element
     * @returns {string}
     */
    collectStyles (element) {
        let win = document.defaultView || window;
        let style = [];
        // string variable to hold styling for each element
        let elementStyle = '';
        if (win.getComputedStyle) { // modern browsers
            style = win.getComputedStyle(element, '');
            for (let i = 0; i < style.length; i++) {
                // styles including
                let targetStyles = ['border', 'float', 'box'];
                // exact
                let targetStyle = ['clear', 'display', 'width', 'min-width', 'height', 'min-height', 'max-height'];
                // optinal - include margin and padding
                if (this.options.honorMarginPadding) {
                    targetStyle.push('margin', 'padding');
                }
                // optinal - include color
                if (this.options.honorColor) {
                    targetStyle.push('color');
                }
                for (let s = 0; s < targetStyle.length; s++) {
                    if (style[i].indexOf(targetStyles[s]) !== -1 || style[i].indexOf(targetStyle[s]) === 0) {
                        elementStyle += style[i] + ':' + style.getPropertyValue(style[i]) + ';';
                    }
                }
            }
        } else if (element.currentStyle) { // IE
            style = element.currentStyle;
            for (let name in style) {
                if (style.indexOf('border') !== -1 && style.indexOf('color') !== -1) {
                    elementStyle += name + ':' + style[name] + ';';
                }
            }
        }
        // add printer friendly
        elementStyle += PRINT_FRIENDLY_ELEMENT;
        return elementStyle;
    }

    /**
     * @param {Array} elements
     */
    loopNodesCollectStyles (elements) {
        for (let n = 0; n < elements.length; n++) {
            let currentElement = elements[n];
            // Form Printing - check if is element Input
            let tag = currentElement.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                // save style to variable
                let textStyle = this.collectStyles(currentElement);
                // remove INPUT element and insert a text node
                let parent = currentElement.parentNode;
                // get text value
                let textNode = tag === 'SELECT'
                    ? document.createTextNode(currentElement.options[currentElement.selectedIndex].text)
                    : document.createTextNode(currentElement.value);
                // create text element
                let textElement = document.createElement('div');
                textElement.appendChild(textNode);
                // add style to text
                textElement.setAttribute('style', textStyle);
                // add text
                parent.appendChild(textElement);
                // remove input
                parent.removeChild(currentElement);
            } else {
                // get all styling for print element
                currentElement.setAttribute('style', this.collectStyles(currentElement));
            }
            // check if more elements in tree
            let children = currentElement.children;
            if (children.length) {
                this.loopNodesCollectStyles(children);
            }
        }
    }

    /**
     * @param {Element} printElement
     */
    addHeader (printElement) {
        // create header element
        let headerElement = document.createElement('h1');
        // create header text node
        let headerNode = document.createTextNode(this.options.header);
        // build and style
        headerElement.appendChild(headerNode);
        headerElement.setAttribute('style', HEADER_STYLE);
        printElement.insertBefore(headerElement, printElement.childNodes[0]);
    }

    /**
     * @returns {string}
     */
    jsonToHTML () {
        let data = this.options.printable;
        let properties = this.options.properties;
        let htmlData = '<div style="display:flex; flex-direction: column;">';
        // header
        htmlData += '<div style="flex:1; display:flex;">';
        for (let a = 0; a < properties.length; a++) {
            htmlData += '<div style="flex:1; padding:5px;">' + capitalizePrint(properties[a]) + '</div>';
        }
        htmlData += '</div>';
        // create html data
        for (let i = 0; i < data.length; i++) {
            htmlData += '<div style="flex:1; display:flex;';
            htmlData += this.options.border ? 'border:1px solid lightgray;' : '';
            htmlData += '">';
            for (let n = 0; n < properties.length; n++) {
                htmlData += '<div style="flex:1; padding:5px;">' + data[i][properties[n]] + '</div>';
            }
            htmlData += '</div>';
        }
        htmlData += '</div>';
        return htmlData;
    }

    /**
     *
     */
    validateInput () {
        if (!this.options.printable) {
            throw new Error('Missing printable information.');
        }
        if (!this.options.type || typeof this.options.type !== 'string' || PRINT_TYPES.indexOf(this.options.type.toLowerCase()) === -1) {
            throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
        }
    }
}

function addWrapper (htmlData) {
    return '<div style="' + BODY_STYLE + '">' + htmlData + '</div>';
}

// capitalize string
function capitalizePrint (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// check user's browser
function isFirefox () {
    return typeof InstallTrigger !== 'undefined';
}

function isIE () {
    return !!document.documentMode;
}