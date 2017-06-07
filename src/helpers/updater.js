import {autoUpdater} from 'electron-updater';

export default (win) => {
  let Updater = autoUpdater;
  Updater.autoDownload = false;
  const sendStatusToWindow = (text) => {
    win.webContents.send('message', text);
  };

  Updater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });
  Updater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.');
  });
  Updater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.');
  });
  Updater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.');
  });
  Updater.on('download-progress', (ev, progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  });
  Updater.on('update-downloaded', (ev, info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call Updater.quitAndInstall(); immediately
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
    setTimeout(function() {
      Updater.quitAndInstall();  
    }, 5000);
  });

  return Updater;
};
