#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const fs = require('fs');
const app = require('./app');

$client = process.cwd();
$server = __dirname;

commander
    .version('1.0.0')
    .description('AAAAAAAADDDDDDSSSSSS');

commander
    .command('create')
    .alias('c')
    .description('Lista todos packages disponiveis.')
    .action(async () => {
        let a = require(path.join($client, 'docs.js'));


        
        console.log(a)
        let aaa = '';
    })
    .on('--help', function () {
        console.log();
        console.log('  Examples: ');
        console.log('  --> api_docs create');
        console.log();
    });

commander.parse(process.argv);


//fs.writeFileSync('./docs/index.html', layout, 'utf8');