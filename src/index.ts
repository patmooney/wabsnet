import { app, BrowserWindow, ipcMain } from "electron";
import { logManager } from "./core";
import { run } from "./server";
import { getPath } from "./utils/cat";

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 750,
        webPreferences: {
            preload: getPath('html/preload.js')
        }
    });
    // comment below to allow dev tools in browser window
    win.setMenu(null);
    win.loadFile('../content/html/index.html');
    ipcMain.on("loaded", () => {
        logManager.subscribe("debug", (level: string, log: string) => {
            try {
                if (win.webContents.isDestroyed()) {
                    return false;
                }
                win.webContents.send("log-update", `[${level}] - ${log}`);
                return true;
            } catch (e) {
                return false;
            }
        });
        run();
    });
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
