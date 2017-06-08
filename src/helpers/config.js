import jetpack from 'fs-jetpack';
import { app, remote } from 'electron';

const defaultConfig = {
  autoUpdate: false
};
const filename = 'configuration.json';

export const updateConfig = (data) => {
  const userDataDir = jetpack.cwd(app ? app.getPath('userData') : remote.app.getPath('userData'));
  let config = userDataDir.read(filename, 'json') || {};
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      config[prop] = data[prop];
    }
  }
  userDataDir.write(filename, config);
  return config;
};

export const readConfig = () => {
  const userDataDir = jetpack.cwd(app ? app.getPath('userData') : remote.app.getPath('userData'));
  let config = userDataDir.read(filename, 'json') || defaultConfig;
  return config;
};
