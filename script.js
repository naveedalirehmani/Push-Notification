const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
}

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
        throw new Error("Notification permission not granted")
    }

}

const main = async () => {
    // check to see if we have necessary objects in the user browser to create and send push notification. if not then this most probably means that user broswers is not updated.
    console.log(1)
    checkPermission()
    
    // we request user permission to send push notification if allowed Notification.permission() should
    // return granted. also Notification.requestPermission() also returns the permission status, plus it ask for the permission
    // Note that user preferenceses are stored in the browser so this means once permission is granted or denied you cannot ask for the permission again. unless the preferences are manually deleted.
    console.log(2)
    await requestNotificationPermission()
    
    // this function calls a .js file with navigator.serviceWorker.register('sw.js'); 
    // this basically means that this .js file will run in worker context not in main thread, which means is that what ever code is in this file will run even if the web page is closed.
    console.log(3)
    await registerSW()
}

