document.getElementById("refresh").addEventListener("click", function(){
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'refresh'
        });
    }
})