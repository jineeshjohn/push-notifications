//Start setting up XHR

var headers = '"[{"key":"Authorization","value":"key=AIzaSyCLND2O5JLLC8L0sLzOu4wFpBwCPv0rGvU","name":"Authorization","enabled":true},{"key":"Content-Type","value":"application/json","name":"Content-Type","enabled":true},{"key":"Cache-Control","name":"Cache-Control","value":"no-cache"},{"key":"Postman-Token","name":"Postman-Token","value":"f915b4a9-60bb-9b40-674f-c571502c2e02"}]';
var xhr = new XMLHttpRequest();
try {
    xhr.open(method, url, true); //Open the XHR request. Will be sent later

    if (xhrTimeout !== 0) {
        xhr.timeout = xhrTimeout;
    }

    if (pm.testRunner) {
        xhr.onreadystatechange = function(event) {
            _.bind(response.load, model)(event.target);
        };
    } else {
        xhr.onreadystatechange = function(tabId) {
            return function(event) {
                _.bind(response.load, model)(event.target, tabId);
            }
        }(pm.tabManager.currentTabId);
        pm.tabManager.setResponseInTab(pm.tabManager.currentTabId, null);
        //console.log("Associating request with " + pm.tabManager.currentTabId);
    }

    xhr.responseType = responseRawDataType;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i].key.toLowerCase() === "cookie" && postman_electron) {
            //set cookie for domain
            pm.cookieManager.addCookies(url, headers[i].value);
        } else {
            xhr.setRequestHeader(headers[i].key, headers[i].value);
        }
    }

    // TODO Set getForTester params here

    this.prepareForSending();
    // Prepare body
    if (isMethodWithBody) {
        var data = body.get("dataToBeSent");
        // console.log("Data to be sent", data);
        if (data === false) {
            xhr.send();
        } else {
            xhr.send(data);
        }
    } else {
        xhr.send();
    }
    if (!pm.testRunner) {
        pm.tabManager.sentRequest(pm.tabManager.currentTabId, this);
        pm.mediator.trigger("resetRequest");
    }

    this.unset("xhr");
    this.set("xhr", xhr);
} catch (e) {
    //console.log("Error while sending request: " + e.message);
    pm.alerts.error('Error while sending request: ' + e.message);
    return;
}
