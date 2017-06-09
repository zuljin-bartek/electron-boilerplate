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
import { autoUpdater } from './helpers/updater';
import configManager from './helpers/config';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

const setApplicationMenu = () => {
  const menus = [editMenuTemplate, helpMenu];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', () => {
  setApplicationMenu();
  // Initialize updater event handles (it also includes chaning menu to display progress).
  autoUpdater.initialize();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Read configuration for first time and then update menu/start updates.
  configManager.read();
  // Handle menu updates.
  var menu = Menu.getApplicationMenu();
  if (!menu) return;
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'autoUpdate') {
          item.checked = configManager.get().autoUpdate;
          item.click = function() {
            this.checked = !this.checked;
            configManager.update({autoUpdate: this.checked});
          };
        }
      });
    }
  });
  // Start autoUpdater if its enabled.
  if (configManager.get().autoUpdate) { 
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
