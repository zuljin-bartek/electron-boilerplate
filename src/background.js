// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './main-process/menu/dev_menu_template';
import { editMenuTemplate } from './main-process/menu/edit_menu_template';
import { helpMenu } from './main-process/menu/help_menu';
import createWindow from './helpers/window';
import './helpers/updater';
import { updateConfig, readConfig } from './helpers/config';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

const setApplicationMenu = () => {
  const menus = [editMenuTemplate, helpMenu];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
  setApplicationMenu();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Inform new window about updates or not if they are disabled.
  var configuration = readConfig();
  if (configuration.autoUpdate) { 
    mainWindow.webContents.on('did-finish-load', () => {
      // Run updater with reference to window that will be notified about updates.
      autoUpdater.checkForUpdates();
    });
  }

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
