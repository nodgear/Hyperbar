import { join } from 'path';
import { homedir } from 'os';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { Config } from '../shared/config';
class WidgetRepository {
    public loadedWidgets: [widget?: {name:string, main?: string, renderer?: string, version: string, widgetPath?: string, file?: string, run?: any}];
    private isRenderer: boolean;

    constructor() {
        this.loadedWidgets = [];
        this.isRenderer = false
    }

    getWidgetContext() {
        if (!this.isRenderer) {
            const electron = require('electron')
            return {
                config:  new Config(),
                Menu: electron.Menu,
                api: {
                    quit: electron.app.quit,
                    relaunch: electron.app.relaunch,
                    show: electron.app.show,
                    ipcMain:  electron.ipcMain,
                    browserWindow: electron.BrowserWindow,
                    windows: require('../main').windows
                }
            }
        } else {
            const electron = require('electron')

            return {
                config: new Config(),
                api: {
                    ipcRenderer: electron.ipcRenderer,
                    icons: require('feather-icons')
                },
                body: document.getElementById('hyperbar')
            }

        }
    }

    requireWidget(widgetInfo: {file: string, version: string, name: string}) {
        try {
            const widgetObject = require(widgetInfo.file);
            this.loadedWidgets.push(widgetInfo);

            widgetObject.default(this.getWidgetContext())
            
        } catch (err) {
            console.error(`[WIDGET] [${widgetInfo.file}] :: ${err}`);
        }
    }

    loadWidget(widget: string, path: string) {
        const widgetPath = join(path, widget);
        const widgetPathPackageJson = join(widgetPath, 'package.json');

        if (!existsSync(widgetPath)) {
            console.warn(`[WIDGET] [${widgetPath}] :: path is invalid`);
            return;
        }

        if (!existsSync(widgetPathPackageJson)) {
            console.warn(`[WIDGET] [${widgetPath}] :: ${widgetPathPackageJson} does not exist`);
            return;
        }

        let widgetInfo = JSON.parse( readFileSync(widgetPathPackageJson).toString() );
        widgetInfo = Object.assign(widgetInfo, {
            widgetPath,
            file: join(widgetPath, this.isRenderer ? widgetInfo.renderer : widgetInfo.main)
        })
        
        this.requireWidget(widgetInfo);
    }

    loadWidgetsInPaths(isRenderer?: boolean) {
        this.isRenderer = isRenderer ?? false
        // TODO: Detect first run
        // TODO: Load default widgets from hyper repository
        
        this.widgetPaths.forEach(path => {
            const widgets = readdirSync(path);
    
            widgets.forEach(widget => {
                this.loadWidget(widget, path);
            })
        });
    }

    get widgetPaths() {
        const paths = [
            join(homedir(), "./.hyperbar/widgets"),
        ];

        return paths;
    }


}

export default WidgetRepository