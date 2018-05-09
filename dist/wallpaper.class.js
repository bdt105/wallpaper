"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wallpaper = /** @class */ (function () {
    function Wallpaper(conf) {
        if (conf === void 0) { conf = null; }
        this.fs = require('fs');
        this.request = require('request');
        this.conf = conf;
    }
    Wallpaper.prototype.loadConf = function (force) {
        if (force === void 0) { force = false; }
        if (!force) {
            if (!this.conf) {
                var contents = this.fs.readFileSync('conf.json', 'utf8');
                this.conf = JSON.parse(contents);
            }
        }
        else {
            var contents = this.fs.readFileSync('conf.json', 'utf8');
            this.conf = JSON.parse(contents);
        }
    };
    Wallpaper.prototype.change = function () {
        var _this = this;
        this.loadConf();
        this.request.get({ url: this.conf.url, encoding: 'binary' }, function (err, response, body) {
            _this.fs.writeFile(_this.conf.imageFileName, body, 'binary', function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("The file was saved!");
                    this.setWallpaperFile();
                }
            });
        });
    };
    ;
    Wallpaper.prototype.setWallpaperFile = function () {
        var spawnSync = require('child_process').spawnSync;
        var pwd = spawnSync('pwd');
        var fileName = 'file://' + pwd.stdout.toString().replace(/\n$/, '') + '/' + this.conf.imageFileName;
        spawnSync('gsettings', ['set', 'org.gnome.desktop.background', 'picture-uri', fileName]);
        console.log(fileName);
    };
    Wallpaper.prototype.start = function () {
        var _this = this;
        this.loadConf();
        this.change();
        this.setWallpaperFile();
        var interval = this.conf.interval * 1000 * 60;
        setInterval(function () {
            _this.change();
        }, interval);
    };
    return Wallpaper;
}());
exports.Wallpaper = Wallpaper;
