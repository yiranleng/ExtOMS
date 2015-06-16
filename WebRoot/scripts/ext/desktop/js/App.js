/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.app.App = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });

    Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable, {
    isReady: false,
    startMenu: null,
    modules: null,
			desktop : null,
			styles : null,
    getStartConfig : function(){

    },

    initApp : function(){
    	this.startConfig = this.startConfig || this.getStartConfig();

        this.desktop = new Ext.Desktop(this);

		this.launcher = this.desktop.taskbar.startMenu;

		this.modules = this.getModules();
        if(this.modules){
            this.initModules(this.modules);
        }
		this.launchers = this.launchers || this.getLaunchers();
		this.initLaunchers();
		this.styles = this.styles || this.getStyles();
		this.initStyles();
        this.init();

        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
        this.isReady = true;
    },

    getModules : Ext.emptyFn,
    init : Ext.emptyFn,
	getLaunchers : Ext.emptyFn,
	getStyles : Ext.emtpyFn,
    initModules : function(ms){
		for(var i = 0, len = ms.length; i < len; i++){
            var m = ms[i];
            this.launcher.add(m.launcher);
            m.app = this;
        }
    },

    getModule : function(name){
    	var ms = this.modules;
    	for(var i = 0, len = ms.length; i < len; i++){
    		if(ms[i].id == name || ms[i].appType == name){
    			return ms[i];
			}
        }
        return '';
    },

    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    getDesktop : function(){
        return this.desktop;
    },
			initLaunchers : function() {
				var l = this.launchers;
				if (!l) {
					return false;
				}
				if (l.shortcut) {
					this.initShortcut(l.shortcut);
				}
				return true;
			},
			initShortcut : function(mIds) {
				if (mIds) {
					for (var i = 0, len = mIds.length; i < len; i++) {
						
//						alert('App96:'+mIds[i].id);//wuxiaoxu test
						
						this.desktop.addShortcut(mIds[i], false);
					}
				}
			},
			initStyles : function() {
				var s = this.styles;
				if (!s) {
					return false;
				}
				this.desktop.setBackgroundColor(s.backgroundColor);
				this.desktop.setFontColor(s.fontColor);
				this.desktop.setTheme(s.theme);
				this.desktop.setTransparency(s.transparency);
				this.desktop.setWallpaper(s.wallpaper);
				this.desktop.setWallpaperPosition(s.wallpaperPosition);
				return true;
			},
    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    }
});