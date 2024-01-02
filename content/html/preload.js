const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld('electronAPI',{
    onLogUpdate: (callback) => ipcRenderer.on("log-update", (_, value) => callback(value)),
    onLoad: () => ipcRenderer.send("loaded")
});
