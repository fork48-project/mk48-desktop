// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const DiscordRPC = require('discord-rpc');

function getSettings(name: string) : string {
	if (typeof process.env["MK48_" + name.toUpperCase()] !== "undefined") {
		//console.log(`${"MK48_" + name.toUpperCase()} does exist ${process.env["MK48_" + name.toUpperCase()] == "enabled" ? "and is enabled": "but is not enabled"}`);

		return process.env["MK48_" + name.toUpperCase()];
	}
	//console.log(`${"MK48_" + name.toUpperCase()} does not exist.`);
	return "disabled";
}

var mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	// and load the index.html of the app.
	mainWindow.loadURL("https://mk48.io");
	mainWindow.setMenu(null);
	
	//mainWindow.loadFile('index.html');

	// Open the DevTools.
	if (getSettings("debugmenu") == "enabled") {
		mainWindow.webContents.openDevTools();
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const clientId = "869542716961345556";

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: "ipc" });
const startTimestamp = new Date();

async function setActivity() {
	if (!rpc || !mainWindow) {
		return;
	}

	const playername = await mainWindow.webContents.executeJavaScript("window.localStorage.name") ?? "Unknown/Invalid Name!";
	
	rpc.setActivity({
		details: "Playing Mk48.io",
		state: `Name: "${playername}"`,
		startTimestamp,
		instance: false,
		largeImageKey: "mk48io3"
	});
}

rpc.on("ready", () => {
	setActivity();

	setInterval(() => {
		setActivity();
	}, 15e3);
});

rpc.login({ clientId }).catch(console.error);

//console.log("Hello, World!");