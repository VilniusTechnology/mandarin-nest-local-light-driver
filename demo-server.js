const LedEmulatorServer = require('./dist/server').LedEmulatorServer;

const log4js = require('log4js');
const logger = log4js.getLogger();

logger.level = 'debug';

let les = new LedEmulatorServer(logger);
les.launch();

