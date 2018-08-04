#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const fse = require('fs-extra');

$client = process.cwd();
$server = path.join(__dirname, '..');
$docs = null;

commander
    .version('1.0.0')
    .description('AAAAAAAADDDDDDSSSSSS');

commander
    .command('create')
    .alias('c')
    .option("-p, --path [value]", "Informar caminho e nome do arquivo de configuração.")
    .description('Lista todos packages disponiveis.')
    .action(async (options) => {
        try {
            let _path = options.path || '';

            $docs = require(path.join($client, _path, 'docs.js'));
            const html = require('./app');
            fse.writeFileSync(path.join($server, 'docs', 'index.html'), html, 'utf8');
            fse.copySync(path.join($server, 'docs'), path.join($client, 'docs_ex'));
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
