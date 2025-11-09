// preload.js - expose a safe API for renderer if needed
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add functions here if we need main<->renderer IPC later
});
