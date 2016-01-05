'use strict';
const electron = require('electron');
const child_process = require('child_process');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

const MNESIA_DIR = '/mnesia';

// DEV Settings
//const SKYRAID_DIR = 'app/';

// PROD settings
const SKYRAID_DIR = '/Users/marcusnilsson/VBoxShared/test/skyraid/rel';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    nodeIntegration: false
  });

  // and load the index.html of the app.
  //mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.loadURL('http://localhost:9080/#/register');


  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  startSkyraidServer();

});

function startSkyraidServer() {

  var appData = app.getPath('userData');

  // // Fungerar !!
  var cmd = SKYRAID_DIR + '/skyraid/bin/skyraid console ';

  // Mnesia config
  cmd += '-mnesia dir \'"' + appData + MNESIA_DIR + '"\' ';

  var child = child_process.exec(cmd);
  // var child = child_process.spawn(SKYRAID_DIR + 'skyraid/bin/skyraid', ['console', '-mnesia dir \'"' + appData + MNESIA_DIR + '"\''] );

  child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    // If the server is started, reload the main window
    if (data.includes('[info] ======= REST on')) {
      mainWindow.reload();
    }
  });

  child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
  });

  child.on('close', function(code) {
    console.log('closing code: ' + code);
  });
}
