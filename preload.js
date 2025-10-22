// A preload script contains code that runs before your web page is loaded into the browser window.
// It has access to both DOM APIs and Node.js environment, and is often used to expose privileged APIs to
// the renderer via the contextBridge API.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchData: () => ipcRenderer.invoke("fetchData"),
  sendObjData: (obj) => ipcRenderer.send('send-objinfo', obj),
});
