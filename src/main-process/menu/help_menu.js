import { app } from 'electron';
import {autoUpdater} from 'electron-updater';

const version = app.getVersion();

let template = {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'Auto-Update',
    type: 'checkbox',
    checked: false,
    key: 'autoUpdate'
    // click: (elem) => {
    //   console.log("clicked?", elem.checked, elem);
    // }
  }]
};

function addUpdateMenuItems (items, position) {
  if (process.mas) return;

  let updateItems = [{
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
