const { execSync } = require('child_process');
const glob = require('glob');
const path = require('path');

// Match all input files
const files = glob.sync('js/*.js');

// Generate a bundle for each file
files.forEach((file) => {
    const filename = path.basename(file, '.js');
    const output = `dist/${filename}-bundle.js`;
    const command = `browserify ${file} -o ${output}`;
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
});
