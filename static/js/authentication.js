let jwtObject = null;
let fullCookies = document.cookie.split("; ");
for (let a = 0; a < fullCookies.length; ++a) {
    if (fullCookies[a].substring(0, fullCookies[a].indexOf("=")) === "token") {
        jwtObject = JSON.parse(window.atob(fullCookies[a].substring(fullCookies[a].indexOf("=") + 1).split(".")[1]));
    }
}

if (jwtObject !== null) {
    window.logged_in = true;
    document.getElementById("welcome").innerHTML = `Welcome, ${jwtObject.name}. You are logged in through Google.`;
    document.getElementById("sign_out_button").addEventListener("click", () => {
        document.cookie.split(";").forEach((cookie) => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        // if you are on home page, it is "", if you are on city, it is "city", etc.
        const urlLocation = window.location.href.replace(/^(?:\/\/|[^/]+)*\//, "");
        if (urlLocation === "locker") {
            window.location.href = "/";
        } else {
            location.reload();
        }
    });
} else {
    window.logged_in = false;
}
