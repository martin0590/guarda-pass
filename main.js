const { app, BrowserWindow, ipcMain, Menu  } = require('electron')
const path = require('node:path')
const fs = require('node:fs/promises')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundMaterial: 'acrylic',
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  Menu.setApplicationMenu(null);

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  
  ipcMain.on('send-objinfo', handleSendInfo)
  ipcMain.handle('fetchData', fetchInformation)
  
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})




const handleSendInfo = async (event, obj) => {
  const filePath = path.join(__dirname, 'information.json')
  const fetchedInformation = await fs.readFile(filePath, {encoding: 'utf8'})
  const parsedInformation = JSON.parse(fetchedInformation)
  parsedInformation.push(obj)

  await fs.writeFile(filePath, JSON.stringify(parsedInformation), 'utf8')

}

const fetchInformation = async () => {
    const filePath = path.join(__dirname, 'information.json')
    let fetchedInformation
    try {
        await fs.access(filePath)
        fetchedInformation = await fs.readFile(filePath, {encoding: 'utf8'})
    } catch (error) {
        if(error.code === 'ENOENT'){
            try {
                const contentString = JSON.stringify([], null, 2)
                await fs.writeFile(filePath, contentString, 'utf8')
                fetchedInformation = await fs.readFile(filePath, {encoding: 'utf8'})
            } catch (error) {
                console.error(`Error creating empty file`)
            }
        } else{
            console.error(`Error accesing and fetching file`)
        }
    }
    return fetchedInformation
}


