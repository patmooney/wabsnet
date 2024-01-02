const log = document.getElementById("the-log");

window.electronAPI.onLogUpdate((value) => {
    const entry = document.createElement('p');
    entry.innerText = value;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
});

window.addEventListener("load", () => window.electronAPI.onLoad());
