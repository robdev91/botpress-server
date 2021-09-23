const { getBasename, isDirectory } = require('../utils/file')
const watcher = require('./watcher')

class Connection {
  constructor(io, socket, pathes) {
    this.socket = socket;
    this.io = io;
    this.pathes = pathes;
    this.watchers = [];
    this.initWatchers();

    socket.on('reload', () => this.reload());
    socket.on('expand', (item) => this.expand(item));
    socket.on('collapse', (item) => this.collapse(item));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  handleWatcherEvent = (id, event) => {
    this.socket.emit(`event-${id}`, {
      type: event.type,
      path: event.path,
      name: getBasename(event.path), 
      isDirectory: event.isDirectory,
    })
  }

  initWatchers = () => {
    this.watchers = this.pathes.map((path, index) => watcher(path, index, this.handleWatcherEvent));
    this.sendWatchers();
  }

  sendWatchers = () => {
    this.socket.emit('watchers', this.watchers.map(watcher => ({
      id: watcher.id,
      basename: watcher.basename,
      isDirectory: watcher.isDirectory,
    })))
  }

  reload = () => {
    this.initWatchers();
  }

  expand = (item) => {
    const { id, path } = item
    this.watchers[id].expand(path)
  }

  collapse = (item) => {
    const { id, path } = item
    this.watchers[id].collapse(path)
  }

  disconnect() {
    this.watchers.forEach(watcher => watcher.dispose());
  }
}

function chat(io, pathes) {
  io.on('connection', (socket) => {
    new Connection(io, socket, pathes);   
  });
};

module.exports = chat;