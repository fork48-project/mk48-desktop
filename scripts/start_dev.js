const { execSync } = require('child_process');

execSync("npm run build");
execSync("npm run start");