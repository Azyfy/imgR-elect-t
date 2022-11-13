const path = require("path")
const os = require("os")
const { app, BrowserWindow, Menu, ipcMain } = require("electron")

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"
console.log("Platform " + process.platform)
console.log("Env " + process.env.NODE_ENV)

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"))

    // Open the DevTools.
    if(isDev) {
        mainWindow.webContents.openDevTools()
    }

}

function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: "About Image Resizer",
        width: 300,
        height: 300
    })

    aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"))

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createMainWindow()

    //Implement menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    app.on("activate", () => {
         // On macOS it's common to re-create a window in the app when the
         // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
})

ipcMain.on("image:resize", (e, options) => {
    options.dest = path.join(os.homedir(), "imageresizer")
    console.log(options)
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (!isMac) {
      app.quit()
    }
  })

  // Menu template
  const menu = [
      ...(isMac ? [{
          label: app.name,
          submenu: [
              {
                  label: "About",
                  click: createAboutWindow
              }
          ]
      }] : []),
      {
          role: "fileMenu"
      },
      ...(!isMac ? [{
          label: "Help",
          submenu: [
              {
                  label: "About",
                  click: createAboutWindow
              }
          ]
      }] : [])
  ]

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.