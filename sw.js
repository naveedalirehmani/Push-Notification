const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    console.log(subscription,'asf')
    const response = await fetch('http://localhost:3000/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    })

    return response.json()
}

// this is called when you register a service worker with navigator.serviceWorker.register('sw.js');

self.addEventListener("activate", async (e) => {

    // we request a subscription from a push service.
    // for this we need to pass 2 params. A public key & userVisibleOnly set to true.
    // public key is used by is used by the push server to authenticate when a notification is sent to client from server.
    // so the flow goes like this.
    // 1. when you request a subscription from push server, it generates a unique url for your browser  that can be used to identify your browser
    // 2. this subscription objects contains the url
    // 3. when the backend server tries to send the push notification it provides the private key
    // 4. the push server uses the public key in the url and the private key to match both of them.
    // 5. if the private key & public key matches the push server send the notification to the url.
    // this ensures that your browser will not receive random notification for every server.
    // & just because 1 web app in the browser subscribed does not mean that your server will be able to send notificaiton to evey web app in the same browser. 
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BMWJSs6g7wIxiW-7ZjrM7ZgMKnqe15yeRthJ9HwTMayjE9CscYI5RmfheIIIPLOdtlm91Lono2nWO92zUh70vWQ")
    })

    // subscription is sent to browser.
    // procide to app.js to continue the flow
    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener("push", e => {
    console.log('called',e.data.text())
    self.registration.showNotification("Wohoo!!", { body: e.data.text() })
})
