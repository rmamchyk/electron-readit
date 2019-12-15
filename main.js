const {app, BrowserWindow} = require('electron')
const windowStateKeeper = require('electron-window-state')

let mainWindow

function createWindow () {
  const state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('renderer/main.html')
  mainWindow.webContents.openDevTools();

  state.manage(mainWindow)

  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
