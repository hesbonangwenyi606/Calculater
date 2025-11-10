// main.js - Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 420,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools();
}

// Listen for button click from renderer
ipcMain.on('button-clicked', (event) => {
  console.log('Button was clicked!');
  // Optional: show a dialog popup
  // const { dialog } = require('electron');
  // dialog.showMessageBox({ message: 'Button clicked!' });
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
