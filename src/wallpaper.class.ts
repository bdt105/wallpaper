export class Wallpaper {
    public conf: any;

    private fs      = require('fs');
    private request = require('request');
    
    constructor(conf: any = null){
        this.conf = conf;
    }

    private loadConf(force: boolean = false){
        if (!force){
            if (!this.conf){
                var contents = this.fs.readFileSync('conf.json', 'utf8');
                this.conf = JSON.parse(contents);
            }
        }else{
            var contents = this.fs.readFileSync('conf.json', 'utf8');
            this.conf = JSON.parse(contents);
        }
    }

    change(){
        this.loadConf();
        this.request.get({url:this.conf.url, encoding: 'binary'}, 
            (err, response, body) => {
                this.fs.writeFile(this.conf.imageFileName, body, 'binary', function(err) {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                        this.setWallpaperFile();
                    }
                }); 
            }
        );
    };
        
    setWallpaperFile(){
        var { spawnSync } = require( 'child_process' )
        var pwd = spawnSync('pwd');
        var fileName = 'file://' + pwd.stdout.toString().replace(/\n$/, '') + '/' + this.conf.imageFileName;
        spawnSync('gsettings', ['set', 'org.gnome.desktop.background', 'picture-uri', fileName]);
        console.log(fileName);
    }

    start(){
        this.loadConf();
        this.change();
        this.setWallpaperFile();
        let interval = this.conf.interval * 1000 * 60;
        setInterval(() => {
            this.change();
        }, interval)        
    }
    
}