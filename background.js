browser.contextMenus.create({
    id: "open-csv-in-iodide-link",
    title: "Open this CSV in Iodide 🤠...",
    contexts: ["link"],
});

browser.contextMenus.create({
    id: "open-csv-in-iodide-page",
    title: "Open this CSV in Iodide 🤠...",
    contexts: ["page"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.includes("open-csv-in-iodide")) {
        const url = info.menuItemId === 'open-csv-in-iodide-link' ? info.linkUrl : info.pageUrl
        const safeUrl = escapeHTML(url);
        const encodedUrl = encodeURI(safeUrl)
        const csvDestination = `https://iodide.io/master/?jsmd=%25%25%20meta%0A%7B%0A%20%20%22lastSaved%22%3A%20%222018-06-28T02%3A24%3A28.457Z%22%2C%0A%20%20%22lastExport%22%3A%20%222018-06-28T03%3A21%3A02.406Z%22%0A%7D%0A%0A%25%25%20resource%0Ahttps%3A%2F%2Fd3js.org%2Fd3-dsv.v1.min.js%0A%0A%25%25%20js%0Avar%20data%0Alet%20url%20%3D%20'${encodedUrl}'%0Aiodide.evalQueue.await(%5Bfetch(url)%0A%20%20.then(d%3D%3Ed.text())%0A%20%20.then(d%3D%3Ed3.csvParse(d))%0A%20%20.then(d%3D%3E%7Bdata%3Dd%3Breturn%20%22parsed%20set%20in%20variable%20'data'%22%7D)%5D)%0A%0A%25%25%20js%0Adata`
        browser.tabs.create({url: "/open-csv.html"}).then(() => {
            browser.tabs.executeScript({
                code: `window.location="${csvDestination}"`
            });
          });
    }
});

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
