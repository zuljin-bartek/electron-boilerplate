import { autoUpdater } from 'electron-updater';
import { Menu, BrowserWindow } from 'electron';

var state = 'no-update';

autoUpdater.initialize = function () {
  if (process.mas) return;

  autoUpdater.on('checking-for-update', function () {
    BrowserWindow.getFocusedWindow().webContents.send('message', 'checking-for-update');
    state = 'checking';
    updateMenu();
  });

  autoUpdater.on('update-available', function () {
    BrowserWindow.getFocusedWindow().webContents.send('message', 'update-available');
    state = 'checking';
    updateMenu();
  });

  autoUpdater.on('update-downloaded', function () {
    BrowserWindow.getFocusedWindow().webContents.send('message', 'update-downloaded');
    state = 'installed';
    updateMenu();
  });

  autoUpdater.on('update-not-available', function () {
    BrowserWindow.getFocusedWindow().webContents.send('message', 'update-not-available');
    state = 'no-update';
    updateMenu();
  });

  autoUpdater.on('error', function () {
    BrowserWindow.getFocusedWindow().webContents.send('message', 'error');
    state = 'no-update';
    updateMenu();
  });

  // autoUpdater.checkForUpdates();
};

function updateMenu() {
  if (process.mas) return;

  var menu = Menu.getApplicationMenu();
  if (!menu) return;

  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        switch (item.key) {
          case 'checkForUpdate':
            item.visible = state === 'no-update';
            break;
          case 'checkingForUpdate':
            item.visible = state === 'checking';
            break;
          case 'restartToUpdate':
            item.visible = state === 'installed';
            break;
        }
      });
    }
  });
};

export { autoUpdater };
