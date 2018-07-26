const comuns = require('./comuns');

module.exports = init;

function init() {
    let html = comuns.componentCompile('menu', {
        controllers: comuns.obj.controllers
    });
    return html;
}