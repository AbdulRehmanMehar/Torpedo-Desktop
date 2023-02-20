import * as dotEnv from 'dotenv';
import { app, BrowserWindow, shell } from 'electron';
import * as path from 'path';
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

dotEnv.config();


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('will-navigate', function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  // and load the index.html of the app.
  if (app.isPackaged) {
    const pathOfBuild = path.join(__dirname, './build/index.html');
    console.log(pathOfBuild, '.............................................');
    
    mainWindow.loadFile(pathOfBuild);
    return;
  }

  mainWindow.loadURL('http://localhost:1133');

  mainWindow.webContents.once("dom-ready", async () => {
    mainWindow.webContents.openDevTools();
  })
    // await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log("An error occurred: ", err))
    //   .finally(() => {
    //   });
    // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
