import { autoUpdater } from 'electron-updater';
import { Menu, BrowserWindow } from 'electron';

var state = 'checking';

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

  autoUpdater.checkForUpdates();
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
// return autoUpdater;

// export default (win) => {
//   let Updater = autoUpdater;
  
//   const sendStatusToWindow = (text) => {
//     win.webContents.send('message', text);
//   };

//   Updater.on('checking-for-update', () => {
//     sendStatusToWindow('Checking for update...');
//   });
//   Updater.on('update-available', (ev, info) => {
//     sendStatusToWindow('Update available.');
//   });
//   Updater.on('update-not-available', (ev, info) => {
//     sendStatusToWindow('Update not available.');
//   });
//   Updater.on('error', (ev, err) => {
//     sendStatusToWindow('Error in auto-updater.');
//   });
//   Updater.on('download-progress', (ev, progressObj) => {
//     let log_message = "Download speed: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//     sendStatusToWindow(log_message);
//   });
//   Updater.on('update-downloaded', (ev, info) => {
//     // Wait 5 seconds, then quit and install
//     // In your application, you don't need to wait 5 seconds.
//     // You could call Updater.quitAndInstall(); immediately
//     sendStatusToWindow('Update downloaded; will install in 5 seconds');
//     setTimeout(function() {
//       Updater.quitAndInstall();  
//     }, 5000);
//   });

//   return Updater;
// };
