const globals = require('./globals');

module.exports = (id) => {
    return id in globals;
}
