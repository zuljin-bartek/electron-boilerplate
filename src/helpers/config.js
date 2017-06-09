// Helper that wrapps jetpack to handle configfile 
import jetpack from 'fs-jetpack';
import { app, remote } from 'electron';

export default (function() {
  const defaultConfig = {
    autoUpdate: false
  };
  const filename = 'configuration.json';
  let configuration = {};

  return {
    get: () => {
      return configuration;
    },
    read: () => {
      const userDataDir = jetpack.cwd(app ? app.getPath('userData') : remote.app.getPath('userData'));
      configuration = userDataDir.read(filename, 'json') || defaultConfig;
      return configuration;
    },
    update: (data, reread) => {
      const userDataDir = jetpack.cwd(app ? app.getPath('userData') : remote.app.getPath('userData'));
      if (reread){
        configuration = userDataDir.read(filename, 'json') || defaultConfig;
      }
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          configuration[prop] = data[prop];
        }
      }
      userDataDir.write(filename, configuration);
      return configuration;
    }
  };
})();
