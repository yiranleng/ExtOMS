/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.Desktop = function(app) {
    this.taskbar = new Ext.ux.TaskBar(app);
    var taskbar = this.taskbar;
    this.xTickSize = this.yTickSize = 1;

    var desktopEl = Ext.get('x-desktop');
    var taskbarEl = Ext.get('ux-taskbar');
	this.shortcuts = new Ext.ux.Shortcuts({
				renderTo : 'x-desktop',
				taskbarEl : taskbarEl
			});
    var windows = new Ext.WindowGroup();
    var activeWindow;

    function minimizeWin(win) {
        win.minimized = true;
        win.hide();
    }

    function markActive(win) {
        if (activeWindow && activeWindow != win) {
            markInactive(activeWindow);
        }
        taskbar.setActiveButton(win.taskButton);
        activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    }

    function markInactive(win) {
        if (win == activeWindow) {
            activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }

    function removeWin(win) {
        taskbar.removeTaskButton(win.taskButton);
        layout();
    }

    function layout() {
        desktopEl.setHeight(Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight());
    }
    Ext.EventManager.onWindowResize(layout);

    this.layout = layout;

    this.createWindow = function(config, cls) {
        var win = new(cls || Ext.Window)(
        Ext.applyIf(config || {},
        {
            renderTo: desktopEl,
            manager: windows,
            minimizable: true,
            maximizable: true
        })
        );
        win.dd.xTickSize = this.xTickSize;
        win.dd.yTickSize = this.yTickSize;
        if (win.resizer) {
            win.resizer.widthIncrement = this.xTickSize;
            win.resizer.heightIncrement = this.yTickSize;
        }
        win.render(desktopEl);
        win.taskButton = taskbar.addTaskButton(win);

        win.cmenu = new Ext.menu.Menu({
            items: [

            ]
        });

       // win.animateTarget = win.taskButton.el;

        win.on({
            'activate': {
                fn: markActive
            },
            'beforeshow': {
                fn: markActive
            },
            'deactivate': {
                fn: markInactive
            },
            'minimize': {
                fn: minimizeWin
            },
            'close': {
                fn: removeWin
            }
        });

        layout();
        return win;
    };

    this.getManager = function() {
        return windows;
    };

    this.getWindow = function(id) {
        return windows.get(id);
    };

    this.getWinWidth = function() {
        var width = Ext.lib.Dom.getViewWidth();
        return width < 200 ? 200: width;
    };

    this.getWinHeight = function() {
        var height = (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight());
        return height < 100 ? 100: height;
    };

    this.getWinX = function(width) {
        return (Ext.lib.Dom.getViewWidth() - width) / 2;
    };

    this.getWinY = function(height) {
        return (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight() - height) / 2;
	};
	// change the style start
	this.setBackgroundColor = function(hex) {
		if (hex) {
			Ext.get(document.body).setStyle('background-color', '#' + hex);
			app.styles.backgroundColor = hex;
		}
	};

	this.setFontColor = function(hex) {
		if (hex) {
			Ext.util.CSS
					.updateRule('.ux-shortcut-btn-text', 'color', '#' + hex);
			app.styles.fontColor = hex;
		}
	};

	this.setTheme = function(o) {
		if (o && o.id && o.name && o.pathFile) {
			Ext.util.CSS.swapStyleSheet('theme', o.pathFile);
			app.styles.theme = o;
		}
	};

	this.setTransparency = function(v) {
		if (v >= 0 && v <= 100) {
			taskbarEl.addClass("transparent");
			Ext.util.CSS.updateRule('.transparent', 'opacity', v / 100);
			Ext.util.CSS.updateRule('.transparent', '-moz-opacity', v / 100);
			Ext.util.CSS.updateRule('.transparent', 'filter', 'alpha(opacity='
							+ v + ')');
			app.styles.transparency = v;
		}
	};
	this.setWallpaper = function(o) {
		if (o && o.id && o.name && o.pathFile) {

			/*
			 * var notifyWin = this.showNotification({ html : 'Loading
			 * wallpaper...', title : 'Please wait' });
			 */
			var wp = new Image();
			wp.src = o.pathFile;

			var task = new Ext.util.DelayedTask(verify, this);
			task.delay(200);

			app.styles.wallpaper = o;
		}

		function verify() {
			if (wp.complete) {
				task.cancel();

				// notifyWin.setIconClass('x-icon-done');
				// notifyWin.setTitle('Finished');
				// notifyWin.setMessage('Wallpaper loaded.');
				// this.hideNotification(notifyWin);

				document.body.background = wp.src;
			} else {
				task.delay(200);
			}
		}
	};

	this.setWallpaperPosition = function(pos) {
		if (pos) {
			if (pos === "center") {
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-tile');
				b.addClass('wallpaper-center');
			} else if (pos === "tile") {
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-center');
				b.addClass('wallpaper-tile');
			}
			app.styles.wallpaperPosition = pos;
		}
	};
	
	
	
	
	
	
		// change the style end
	this.addShortcut = function(c, updateConfig) {
		shortcut = this.shortcuts.addShortcut({
					id : c.id,
					iconCls : c.id,
					scope : c.scope,
					text : c.text,
					tooltip : c.tooltip || ''
				});
//		alert('Desktop:224'+shortcut.id);//wuxiaoxu test		
		if (updateConfig) {
			app.launchers.shortcut.push(c.id);
		}
	};
	this.removeShortcut = function(id, updateConfig) {
		var m = app.getModule(id);

		if (m && m.shortcut) {
			this.shortcuts.removeShortcut(m.shortcut);
			m.shortcut = null;

			if (updateConfig) {
				var sc = app.launchers.shortcut, i = 0;
				while (i < sc.length) {
					if (sc[i] == id) {
						sc.splice(i, 1);
					} else {
						i++;
					}
				}
			}
		}
	};
	layout();

	
	var rightClick = new Ext.menu.Menu({
				id : 'rightClickCont',
				allowOtherMenus : true,
				ignoreParentClicks : true,
				items : [
						{
							id : 'mainMenu-Setting',
							text : '\u8bbe\u7f6e',
							iconCls : 'pref-icon',
							handler : function() {
								var pre = new Ext.util.QoPreferences();
								pre.createWindow(app);
							}
						},'-'
						,{//mayuxue 20111020
							id : 'mainMenu-ShowDesktop',
							text : '\u663e\u793a\u684c\u9762',
							icon : '/scripts/ext/desktop/images/Showdesktop.png',
							handler : function(event) {
								windows.hideAll();
							}
						},'-'
						,{
							id : 'mainMenu-Refresh',
							text : '\u5237\u65b0',
							icon : '/scripts/ext/desktop/images/refresh.png',
							handler : function(event) {
								document.location.reload();
							}
						}
//						,'-'
//						,{
//						 text:'\u95e8\u6237\u6a21\u5f0f',
//						 iconCls:'changeModel',
//						 handler :function() {
//						 Ext.MessageBox.confirm('\u6d88\u606f', '\u9875\u9762\u5c06\u8df3\u8f6c\uff0c\u60a8\u7684\u754c\u9762\u4e3b\u9898\u4f1a\u9ed8\u8ba4\u4e3a\u95e8\u6237\u6a21\u5f0f\uff0c\u662f\u5426\u7ee7\u7eed\uff1f', function(bt) {
//						 	if (bt == 'yes') {
//						   Ext.Ajax.request({
//								url : 'openPopMainMenu.html',
//								params : {
//									method : 'tochangeModel',
//									model:'portal'
//								},
//								callback : function(options, success, response) {
//								   window.location.reload();
//								}
//							});
//							}
//							}, this);
//						  },scope:this
//						 }
				]
			});

	desktopEl.focus().on('contextmenu', function(e) {
				e.preventDefault();
				if (desktopEl.id == e.getTarget().id) {
					rightClick.showAt(e.getXY());
				}
			});
	taskbarEl.focus().on('contextmenu', function(e) {
				e.preventDefault();

			});
	
    this.setTickSize = function(xTickSize, yTickSize) {
        this.xTickSize = xTickSize;
        if (arguments.length == 1) {
            this.yTickSize = xTickSize;
        } else {
            this.yTickSize = yTickSize;
        }
        windows.each(function(win) {
            win.dd.xTickSize = this.xTickSize;
            win.dd.yTickSize = this.yTickSize;
            win.resizer.widthIncrement = this.xTickSize;
            win.resizer.heightIncrement = this.yTickSize;
        },
        this);
    };

    this.cascade = function() {
        var x = 0,
        y = 0;
        windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        },
        this);
    };

    this.tile = function() {
        var availWidth = desktopEl.getWidth(true);
        var x = this.xTickSize;
        var y = this.yTickSize;
        var nextY = y;
        windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                //              Wrap to next row if we are not at the line start and this Window will go off the end
                if ((x > this.xTickSize) && (x + w > availWidth)) {
                    x = this.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + this.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + this.yTickSize);
            }
        },
        this);
    };

//    this.contextMenu = new Ext.menu.Menu({
//        items: [{
//            text: 'Tile',
//            handler: this.tile,
//            scope: this
//        },
//        {
//            text: 'Cascade',
//            handler: this.cascade,
//            scope: this
//        }]
//    });
//    desktopEl.on('contextmenu',
//        function(e) {
//            e.stopEvent();
//            this.contextMenu.showAt(e.getXY());
//        },
//        this);

    layout();

//    if (shortcuts) {
//        shortcuts.on('click',
//        function(e, t) {
//            t = e.getTarget('dt', shortcuts);
//            if (t) {
//                e.stopEvent();
//                var module = app.getModule(t.id.replace('-shortcut', ''));
//                if (module) {
//                    module.createWindow();
//                }
//            }
//        });
//    }
};
