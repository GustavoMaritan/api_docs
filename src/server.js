#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const fse = require('fs-extra');

$client = process.cwd();
$server = path.join(__dirname, '..');
$docs = null;

commander
    .version('1.0.0')
    .description('Gerar documentação por objeto javascript.');

commander
    .command('create')
    .alias('c')
    .option("-p, --path [value]", "Informar caminho e nome do arquivo de configuração.")
    .description('Lista todos packages disponiveis.')
    .action(async (options) => {
        try {
            let _path = options.path || '';
            $docs = require(path.join($client, _path, 'docs.js'));
            const html = renderHtml();
            fse.writeFileSync(path.join($server, 'docs_template', 'index.html'), html, 'utf8');
            fse.copySync(path.join($server, 'docs_template'), path.join($client, 'docs'));
        } catch (error) {
            console.log(error.message);
        }
    })
    .on('--help', function () {
        console.log();
        console.log('  Examples: ');
        console.log('  --> api_docs create');
        console.log();
    });

commander.parse(process.argv);


function renderHtml() {
    const comuns = require('./render/comuns');
    const header = require('./render/header')();
    const controllers = require('./render/controllers')();
    const menu = require('./render/menu')();

    let html = comuns.componentCompile('layout', {
        title: comuns.obj.api.name,
        menu: menu,
        conteudo: header + controllers.join('')
    });
    return html;
}