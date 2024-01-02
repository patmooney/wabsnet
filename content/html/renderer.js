const log = document.getElementById("the-log");
const toggle = document.getElementById("log-toggle");

window.electronAPI.onLogUpdate((value) => {
    const entry = document.createElement('p');
    entry.innerText = value;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
});

toggle.addEventListener("click", () => {
    toggle.style.display = "none";
    log.style.display = "block";
    log.scrollTop = log.scrollHeight;
});

window.addEventListener("load", () => window.electronAPI.onLoad());
