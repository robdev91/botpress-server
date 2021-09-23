const growthWatcher = require('growth-watch');
const { getBasename, isDirectory } = require('../utils/file');

class Watcher {
  constructor(path, id, cb) {
    this.watcher = new growthWatcher.TreeWatcher(path);

    this.watcher.on("buffer", events => {
      events.forEach(event => this.eventCB(this.id, event));
    });

    this.eventCB = cb;
    this.id = id;
    this.basename = getBasename(path);
    this.isDirectory = isDirectory(path);
  }

  expand = (path) => {
    this.watcher.toggleExpansion(path);
  }

  collapse = (path) => {
    this.watcher.toggleExpansion(path);
  }

  dispose = () => {
    this.watcher.dispose();
  }
}

const watcher = (path, id, cb) => {
  return new Watcher(path, id, cb);
};

module.exports = watcher;
