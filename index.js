#!/usr/bin/env node

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Required modules
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const fs           = require('fs');
const { execSync } = require('child_process');
const readline     = require('readline');
const chalk        = require('chalk');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Files to create
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let packageFile = 'package.json';
let webpackFile = 'webpack.config.js';
let babelFile   = '.babelrc';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Ask a question to the user
//
// query: string
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const askQuestion = (query) => {
    
    const rl = readline.createInterface({
        
        input: process.stdin,
        output: process.stdout
        
    });

    return new Promise(resolve => rl.question(chalk.yellow(query), ans => {
        
        rl.close();
        resolve(ans);
        
    }));
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Creates config files
//
// componentName: string
// componentDesc: string
// authorName: string
// authorWebsite: string
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createConfigFiles = (componentName, componentDesc, authorName, authorWebsite) => {
    
    let packageConfig = {
        
        "name": `${componentName}`,
        "version": "1.0.0",
        "description": `${componentDesc}`,
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "build": "webpack"
        },
        "keywords": [],
        "author": {
            "name": `${authorName}`,
            "url":  `${authorWebsite}`
        },
        "license": "MIT"
        
    }
    
    let webpackConfig = {
        
        "entry": [
            `./src/${componentName}.js`
        ],
        "module": {
            "rules": [
              {
                "test": "/\.(js|jsx)$/",
                "exclude": "/node_modules/",
                "use": ["babel-loader"]
              },
              {
                "test": "/(\.css$)/",  
                "loaders": ["style-loader", "css-loader"]
              }
            ]
        },
        "externals": {
            "react": {
                "root": "React",
                "commonjs2": "react",
                "commonjs": "react",
                "amd": "react"
            },
            "react-dom": {
                "root": "ReactDOM",
                "commonjs2": "react-dom",
                "commonjs": "react-dom",
                "amd": "react-dom"
            }
        },
        "resolve": {
            "extensions": ["*", ".js", ".jsx"]
        },
        "output": {
            "publicPath": "/",
            "filename": "index.js",
            "libraryTarget": "commonjs2"
        },
        "devServer": {
        "contentBase": "./build"
        }
        
    };
    
    let babelConfig = {
        
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
        ]
        
    };
    
    fs.openSync(packageFile, 'w');
    fs.writeFileSync(packageFile, JSON.stringify(packageConfig, null, 4));
    console.log(chalk.green(`✅ ${packageFile} has been created.`));
    
    fs.openSync(webpackFile, 'w');
    fs.writeFileSync(webpackFile, 'module.exports = ');
    fs.appendFileSync(webpackFile, JSON.stringify(webpackConfig, null, 4));
    console.log(chalk.green(`✅ ${webpackFile} has been created.`));
    
    fs.openSync(babelFile,   'w');
    fs.writeFileSync(babelFile,   JSON.stringify(babelConfig,   null, 4));
    console.log(chalk.green(`✅ ${babelFile} has been created.`));
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Creates config files
//
// dependencies: array
// tag: string
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const installDependencies = (dependencies, tag) => {
    
    console.log(chalk.red(`⏳ Installing ${tag} dependencies...`));
    
    execSync(`npm i --save-dev ${dependencies.join(' ')}`);
    
    console.log(chalk.green(`✅ ${tag} dependencies have been installed.`));
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Building packages
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const buildPackage = () => {
    
    console.log(chalk.red(`⏳ Building package`));
    
    execSync(`npm run build`);
    execSync(`rm -rf build`)
    execSync(`mv dist build`);
    
    console.log(chalk.green(`✅ Package built successfully!`));
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main thread
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const main = async () => {
    
    // Printing name of the app
    console.log(chalk.green(`

        ██████╗ ███████╗ █████╗  ██████╗████████╗ ██████╗ ██████╗ 
        ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
        ██████╔╝█████╗  ███████║██║        ██║   ██║   ██║██████╔╝
        ██╔══██╗██╔══╝  ██╔══██║██║        ██║   ██║   ██║██╔══██╗
        ██║  ██║███████╗██║  ██║╚██████╗   ██║   ╚██████╔╝██║  ██║
        ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
    
    `));
    
    // Asking the user some questions
    let componentName = await askQuestion("What is the name of the main component? Example: awesomeComponent \n");
    let componentDesc = await askQuestion("Describe your component. Example: This is the BeSt coMponEnt EveR \n");
    let authorName    = await askQuestion("What is the name of the author? Example: Elon Musk \n");
    let authorWebsite = await askQuestion("What is the webiste of the author? Example: elonmusk.com \n");
    
    // Creating config files depending on answers
    createConfigFiles(componentName, componentDesc, authorName, authorWebsite);
    
    // Installing dependencies
    await installDependencies(['webpack', 'webpack-dev-server', 'webpack-cli'], 'Webpack');
    await installDependencies(['@babel/core', '@babel/preset-env', '@babel/preset-react'], 'Babel');
    await installDependencies(['babel-loader', 'style-loader', 'css-loader'], 'Loader');
    
    // Building the package
    buildPackage();
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Starting main
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
main();