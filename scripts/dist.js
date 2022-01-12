const { execSync } = require('child_process');

function dist(platform, arch) {
	console.log(`Packaging app with platform: ${platform} and arch: ${arch}`);

	try {
		const zipCommand = platform == "linux" ? `tar -czf dist/mk48-${platform}-${arch}.tar.gz dist/mk48-${platform}-${arch}/` : `zip -r dist/mk48-${platform}-${arch}.zip dist/mk48-${platform}-${arch}/`;
		execSync(`npx electron-packager . mk48 --asar --out=dist --platform=${platform} --arch=${arch} --ignore=\"(src*|tsconfig.json|.gitignore|scripts*|dist*)\";${zipCommand};rm -rf dist/mk48-${platform}-${arch}/`);
	} catch (e) {}
}

function dist_darwin() {
	dist("darwin", "x64");
	dist("darwin", "arm64");
}

function dist_linux() {
	dist("linux", "x64");
	dist("linux", "armv7l");
	dist("linux", "arm64");
}

function dist_win32() {
	dist("win32", "ia32");
	dist("win32", "x64");
}

execSync("npm run build");
dist_linux();
dist_win32();
dist_darwin();