const { Server } = require('socket.io');
const { monitor } = require('./services/monitor');
const { getPathList } = require('./utils/file');

const io = new Server(3000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const pathes = getPathList();

monitor(io, pathes);
