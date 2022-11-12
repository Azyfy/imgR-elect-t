const path = require("path")
const { app, BrowserWindow } = require("electron")

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"
console.log("Platform " + process.platform)
console.log("Env " + process.env.NODE_ENV)

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: isDev ? 1000 : 500,
        height: 600
    })

    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"))

    // Open the DevTools.
    if(isDev) {
        mainWindow.webContents.openDevTools()
    }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createMainWindow()

    app.on("activate", () => {
         // On macOS it's common to re-create a window in the app when the
         // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (!isMac) {
      app.quit()
    }
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.