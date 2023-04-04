const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ipc = ipcMain;

//Création d'une fenêtre
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, //largeur
    height: 720, //hauteur
    minWidth: 1024,
    minHeight: 640,
    closable: true,
    darkTheme: true,
    frame: false,
    icon: path.join(__dirname, "./ico.ico"),
    webPreferences: {
      nodeIntegration: true, // permet d'utiliser node dans different script
      contextIsolation: false, // si appli relier a internet mettre true pour isoler l'appli de hack futur
      devTools: true,
      //preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools(); //afficher la console dev

  //Gestion des demandes IPC
  // Top Menu

  ipc.on("reduceApp", () => {
    win.minimize();
  });
  ipc.on("sizeApp", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });
  ipc.on("closeApp", () => {
    win.close();
  });
  ipc.on("reload",() => {
    win.reload()
  });
}

//Quand electron est prêt !
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

//Gestion de la fermeture de toutes les fenêtres
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
