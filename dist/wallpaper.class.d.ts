export declare class Wallpaper {
    conf: any;
    private fs;
    private request;
    constructor(conf?: any);
    private loadConf(force?);
    change(): void;
    setWallpaperFile(): void;
    start(): void;
}
