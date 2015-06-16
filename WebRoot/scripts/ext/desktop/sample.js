MyDesktop = new Ext.app.App({
	init : function() {
		Ext.QuickTips.init();
	},
	getStyles : function() {
		return {
			backgroundColor : '100101',
			fontColor : 'FCFCFC',
			transparency : '100',
			// wallpaperPosition : 'tile',
			wallpaperPosition : 'center', // wuxiaoxu test 控制图片的 显示方式
			theme : {
				id : '4',
				name : 'EXT Glass',
				// pathtofile : '../desktop/desktop.css'
				pathtofile : 'scripts/ext/desktop/themes/xtheme-vistablack/css/xtheme-vistablack.css'
			},
			wallpaper : {
				id : '8',
				name : 'fiel(1280X800像素)',
				pathtofile : 'scripts/ext/desktop/wallpapers/blue-psychedelic.jpg'
			}
		};
	},
	getModules : function() {
		return [new MyDesktop.MyTools()];
	},
	getLaunchers : function() {
		return {
			shortcut : [{
						id : 'UserMenu-shortcut',
						text : '编辑用户信息'
					}, {
						id : 'MyTools-shortcut',
						text : '测试'
					}, {
						id : '2-shortcut',
						text : '哈'
					}, {
						id : '3-shortcut',
						text : '哈哈'
					}, {
						id : '4-shortcut',
						text : '阿斯'
					}, {
						id : '5-shortcut',
						text : '放到'
					}, {
						id : '6-shortcut',
						text : '速度'
					}, {
						id : '7-shortcut',
						text : '得到'
					}, {
						id : '8-shortcut',
						text : '此次'
					}, {
						id : '9-shortcut',
						text : '搜索'
					}]
		}
	},
	getStartConfig : function() {
		return {
			title : 'administratoradmin',
			iconCls : 'user',
			toolItems : [{
						text : '设置',
						iconCls : 'pref-icon',
						handler : function() {
							Ext.Msg.alert('title', 'no');
							var pre = new Ext.util.QoPreferences();
							pre.createWindow(this);
						},
						scope : this
					}, '-', {
						text : '注销',
						iconCls : 'logout',
						handler : function() {
							// window.location.href = 'logout.jsp';//wuxiaoxu
							// test
							Ext.Msg.alert('title', 'no');
						},
						scope : this
					}]
		};
	}
});

MyDesktop.MyTools = Ext.extend(Ext.app.Module, {
	init : function() {
		var thisModule = this;
		this.launcher = {
			text : '我的个人空间',
			iconCls : 'MyTools',
			handler : function() {
				return false;
			},
			menu : {
				listeners : {
					'contextmenu' : {
						fn : function(m, t, e) {
							e.stopEvent();
							alert();// wuxiaoxu test

							if (t.menu == null) {
								if (Ext.getCmp('addToDesMenu')) {
									Ext.getCmp('addToDesMenu').removeAll();
									Ext.getCmp('addToDesMenu').destroy();
								}
								var todes = new Ext.menu.Menu({
									id : 'addToDesMenu',
									items : [{
										text : '发送到桌面快捷',
										handler : function() {
											Ext.Ajax.request({
												url : 'essMenuUsers.html',
												params : {
													method : 'addUserMenu',
													userMenu : t.id
												},
												success : function() {
													thisModule.app
															.initShortcut([{
																id : t.id
																		+ '-shortcut',
																text : t.text
															}]);
												}
											});
										}
									}]
								})
								e.preventDefault();
								todes.showAt(e.getXY());
							}
						}
					}
				},
				items : [{
							text : '编辑用户信息',
							iconCls : 'UserMenu',
							id : 'UserMenu',
							width : 500,
							height : 480,
							scope : this,
							handler : this.nomaxcreateWindow,
							windowId : 'UserMenu',
							width : 500,
							height : 480,
							theHtml : 'editProfile.html'

						}, {
							text : '我的收藏',
							iconCls : 'MyTools',
							id : 'MyTools',
							width : 1024,
							height : 712,
							scope : this,
							handler : this.createWindow,
							windowId : 'MyTools',
							width : 1024,
							height : 712,
							theHtml : 'archiveData.html?content.method=toRealMyFavorateSearch'

						}]
			}
		}
	},
	createWindow : function(src) {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(src.windowId + '_win');
		var modalStatus = false;
		var resizable = true;
		if (src.windowId == 'BatchFtp') {
			modalStatus = true;
			resizable = false;
		}
		alert(1);

		if (!win) {
			win = desktop.createWindow({
						id : src.windowId + '_win',
						title : src.text,
						width : src.width == null ? 800 : (src.width == 5000
								? Ext.get('x-desktop').getRight()
								: src.width),
						height : src.height == null ? 600 : (src.height == 5000
								? Ext.get('x-desktop').getBottom()
								: src.height),
						/*
						 * autoLoad : { url : src.theHtml+
						 * ((src.theHtml).indexOf('?') > 0 ? '&' : '?')+
						 * 'parentWinId=' + src.windowId + '_win', nocache :
						 * true, scripts : true },
						 */
						autoScroll : true,
						modal : modalStatus,
						resizable : resizable,
						iconCls : src.iconCls,
						shim : false,
						animCollapse : false,
						constrainHeader : true
					});
		}
		win.show();
	},
	nomaxcreateWindow : function(src) {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(src.windowId + '_win');
		if (!win) {
			win = desktop.createWindow({
						id : src.windowId + '_win',
						title : src.text,
						width : src.width == null ? 800 : (src.width == 5000
								? Ext.get('x-desktop').getRight()
								: src.width),
						height : src.height == null ? 600 : (src.height == 5000
								? Ext.get('x-desktop').getBottom()
								: src.height),
						/*
						 * autoLoad : { url : src.theHtml+
						 * ((src.theHtml).indexOf('?') > 0 ? '&' : '?') +
						 * 'parentWinId=' + src.windowId + '_win', nocache :
						 * true, scripts : true },
						 */
						autoScroll : true,
						iconCls : src.iconCls,
						shim : false,
						animCollapse : false,
						maximizable : false,
						resizable : false,
						constrainHeader : true
					});
		}
		win.show();
	}
});
