import { app } from 'electron';
import {autoUpdater} from 'electron-updater';


let template = {
  label: 'Help',
  role: 'help',
  submenu: []
};

function addUpdateMenuItems (items, position) {
  const version = app.getVersion();
  if (process.mas) return;

  let updateItems = [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'Auto-Update',
    type: 'checkbox',
    checked: false,
    key: 'autoUpdate'
  }, {
    label: 'Checking for Update',
    enabled: false,
    visible: false,
    key: 'checkingForUpdate'
  }, {
    label: 'Check for Update',
    visible: true,
    key: 'checkForUpdate',
    click: function () {
      autoUpdater.checkForUpdates();
    }
  }, {
    label: 'Restart and Install Update',
    enabled: true,
    visible: false,
    key: 'restartToUpdate',
    click: function () {
      autoUpdater.quitAndInstall();
    }
  }];

  items.splice.apply(items, [position, 0].concat(updateItems));
}

if (process.platform === 'win32') {
  const helpMenu = template.submenu;
  addUpdateMenuItems(helpMenu, 0);
}

export const helpMenu = template;
