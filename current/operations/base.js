//
//load templates
//
// set ajax
let BROWSER_HOST = window.location.host;
let AJAX_HOST = BROWSER_HOST.includes('127.0.0.1') ? 'localhost/pm2503' : 'data.zhounan.org/pm2503';
let AJAX_SCHEME = BROWSER_HOST.includes('127.0.0.1') ? 'http://' : 'https://';
let URLPARAMS = new URLSearchParams(window.location.search);
// header
fetch("/rcdrank/current/operations/header.html", {
    cache: 'no-cache',
    keepalive: true
})
    .then(response => {
        return response.text();
    })
    .then(data => {
        document.getElementById("headerMetaContainer").innerHTML = data;
        //////
        // nav bar
        fetch("/rcdrank/current/operations/navbar.html", {
            cache: 'no-cache',
            keepalive: true
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                document.getElementById("navbarContainer").innerHTML = data;
                //////
                // footer
                fetch("/rcdrank/current/operations/footer.html", {
                    cache: 'no-cache',
                    keepalive: true
                })
                    .then(response => {
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById("footerContainer").innerHTML = data;
                        var d = new Date();
                        document.getElementById('footerYear').textContent = d.getFullYear();
                        return null;
                    });
                //////
            });
        //////
    });


// uuid version 4
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
