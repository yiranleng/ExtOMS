/*
 * qWikiOffice Desktop 0.8.1 Copyright(c) 2007-2008, Integrated Technologies,
 * Inc. licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 */

Ext.override(Ext.util.QoPreferences, {

	actions : null,
	cards : ['pref-win-card-1', // navigation
			'pref-win-card-3', // color and appearance
			'pref-win-card-4'// wallpaper
	],
	contentPanel : null,
	cardHistory : ['pref-win-card-1' // default
	],
	layout : null,
	win : null,
	playWin : null,//liuqiang 20100506 add for onLineHelp 
	
	createWindow : function(app) {
		this.app = app;
		var desktop = app.getDesktop();
		this.win = desktop.getWindow(this.moduleId);
		if (!this.win) {
			var winWidth = 610;
			var winHeight = 510;
			this.contentPanel = new Ext.Panel({
				activeItem : 0,
				border : false,
				id : 'pref-win-content',
				items : [new Ext.util.QoPreferences.NavPanel({
									owner : this,
									id : 'pref-win-card-1'
								}), new Ext.util.QoPreferences.Appearance({
									owner : this,
									id : 'pref-win-card-3'
								}), new Ext.util.QoPreferences.Background({
									owner : this,
									id : 'pref-win-card-4'
								})],
				layout : 'card',
				tbar : [{
							disabled : true,
							handler : this.navHandler.createDelegate(this, [-1]),
							id : 'back',
							scope : this,
							text : '\u540e\u9000'
						}, {
							disabled : true,
							handler : this.navHandler.createDelegate(this, [1]),
							id : 'next',
							scope : this,
							text : '\u524d\u8fdb'
						}]
			});
			
			this.win = desktop.createWindow({
				animCollapse : false,
				constrainHeader : true,
				id : this.moduleId,
				height : winHeight,
				iconCls : 'pref-icon',
				items : this.contentPanel,
				layout : 'fit',
				shim : false,
				taskbuttonTooltip : '<b>Preferences</b><br />Allows you to modify your desktop',
				title : '\u8bbe\u7f6e',
				listeners : {
					/*
					 * 
					 'help' : function(){
						this.playWin = new Ext.Window ({
							title : '\u5728\u7ebf\u5e2e\u52a9--\u8bbe\u7f6e',	
							layout : 'fit',	
							modal : true,
							width : 815,	
							height : 582,	
							resizable :false,	
							maximizable : false,	
							autoLoad : {url : 'OnlineHelpAction.html', params:{filepath : 'Setting',playall : false}, nocache : true, scripts : true }
						});	
						this.playWin.show();
					}
					*/
					
				},
				width : winWidth
			});

			this.layout = this.contentPanel.getLayout();
		}

		this.win.show();
	},

	handleButtonState : function() {
		var cards = this.cardHistory, activeId = this.layout.activeItem.id, items = this.contentPanel
				.getTopToolbar().items, back = items.get(0), next = items
				.get(1);

		for (var i = 0, len = cards.length; i < len; i++) {
			if (cards[i] === activeId) {
				if (i <= 0) {
					back.disable();
					next.enable();
				} else if (i >= (len - 1)) {
					back.enable();
					next.disable();
				} else {
					back.enable();
					next.enable();
				}
				break;
			}
		}
	},

	navHandler : function(index) {
		var cards = this.cardHistory, activeId = this.layout.activeItem.id, nextId;
		for (var i = 0, len = cards.length; i < len; i++) {
			if (cards[i] === activeId) {
				nextId = cards[i + index];
				break;
			}
		}

		this.layout.setActiveItem(nextId);
		this.win.setSize(this.win.getSize().width,this.win.getSize().height-1);
		this.handleButtonState();
	},
	save : function(params) {
		var callback = params.callback || null;
		var callbackScope = params.callbackScope || this;
		params.moduleId = this.moduleId;
//		alert(this.moduleId);//wuxiaoxu test
		Ext.Ajax.request({
					url : '/desktop/savePreferences',
					/*
					 * Could also pass moduleId and action in querystring like
					 * this instead of in the params config option.
					 * 
					 * url:
					 * this.app.connection+'?moduleId='+this.id+'&action=myAction',
					 */
					params : params,
					success : function(o) {
						if (Ext.decode(o.responseText).success) {
							Ext.Msg.alert('\u6d88\u606f', '\u4fdd\u5b58\u6210\u529f\uff01');
						} else {
							Ext.Msg.alert('Error','Errors encountered on the server.');
						}
					},
					failure : function() {
						Ext.Msg.alert('Error', 'Lost connection to server.');
					},
					scope : this
		});
	},

	viewCard : function(card) {
		this.layout.setActiveItem(card);
		this.win.setSize(this.win.getSize().width,this.win.getSize().height-1);
		if (this.cardHistory.length > 1) {
			this.cardHistory.pop();
		}
		this.cardHistory.push(card);
		this.handleButtonState();
	}
});
Ext.util.QoPreferences.NavPanel = function(config) {
	this.owner = config.owner;

	Ext.util.QoPreferences.NavPanel.superclass.constructor.call(this, {
		autoScroll : true,
		bodyStyle : 'padding:15px',
		border : false,
		html : '<ul id="pref-nav-panel"> \
				<li> \
					<img src="'
				+ Ext.BLANK_IMAGE_URL
				+ '" class="icon-pref-appearance"/> \
					<a id="viewAppearance" href="#">\u7cfb\u7edf\u4e3b\u9898</a><br /> \
					<span>\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u8bbe\u7f6e\u4f60\u6240\u559c\u6b22\u7684\u7cfb\u7edf\u4e3b\u9898.</span> \
				</li> \
				<li> \
					<img src="'
				+ Ext.BLANK_IMAGE_URL
				+ '" class="icon-pref-wallpaper"/> \
					<a id="viewWallpapers" href="#">\u684c\u9762\u80cc\u666f</a><br /> \
					<span>\u5728\u8fd9\u91cc\u4f60\u53ef\u4ee5\u9009\u62e9\u8bbe\u7f6e\u684c\u9762\u5899\u7eb8\u548c\u80cc\u666f\u989c\u8272.</span> \
				</li> \
			</ul>',
		id : config.id
	});

	this.actions = {
		'viewAppearance' : function(owner) {
			owner.viewCard('pref-win-card-3');
		},

		'viewWallpapers' : function(owner) {
			owner.viewCard('pref-win-card-4');
		}
	};
};

Ext.extend(Ext.util.QoPreferences.NavPanel, Ext.Panel, {
			afterRender : function() {
				this.body.on({
							'mousedown' : {
								fn : this.doAction,
								scope : this,
								delegate : 'a'
							},
							'click' : {
								fn : Ext.emptyFn,
								scope : null,
								delegate : 'a',
								preventDefault : true
							}
						});

				Ext.util.QoPreferences.NavPanel.superclass.afterRender.call(this); // do sizing calcs last
			},

			doAction : function(e, t) {
				e.stopEvent();
				this.actions[t.id](this.owner); // pass owner for scope
			}
		});

//加载默认主题		
Ext.util.QoPreferences.Appearance = function(config) {
	var beforeTheme;
	var beforeTransparency;
	this.owner = config.owner;
	this.app = this.owner.app;
	var desktop = this.app.getDesktop();
	
	var store = new Ext.data.JsonStore({//wuxiaoxu 
				//baseParams : {
				//	method : 'getThemes'
				//},
//				fields : ['id', 'name', 'pathThumbNail', 'pathFile'],//wuxiaxou 20130722 modify
				fields : ['id', 'name', 'pathThumbNail', 'pathFile'],
				id : 'id',
				root : 'images',
				url : '/desktop/getThemes'
			});
	this.store = store;
	
	store.on('load', function(store, records) {
				if (records) {
					defaults.setTitle('\u7cfb\u7edf\u9ed8\u8ba4\u4e3b\u9898 (' + records.length+ ')');
					var id = this.app.styles.theme.id;
					beforeTheme = this.app.styles.theme;//xiaoxiong 20100307
					beforeTransparency = this.app.styles.transparency;//xiaoxiong 20100506
					if (id) {
						view.select('theme-' + id);
					}
				}
	}, this);




	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="theme-{id}">',
//			'<div class="pref-view-thumb"><img src="{pathThumbNail}" title="{name}" /></div>',
			'<div class="pref-view-thumb"><img src="{pathThumbNail}" title="{name}" /></div>',
			'<span>{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');

	var view = new Ext.DataView({
				autoHeight : true,
				cls : 'pref-thumnail-view',
				emptyText : 'No themes to display',
				itemSelector : 'div.pref-view-thumb-wrap',
				loadingText : 'loading...',
				singleSelect : true,
				overClass : 'x-view-over',
				prepareData : function(data) {
					data.shortName = Ext.util.Format.ellipsis(data.name, 17);
					return data;
				},
				store : store,
				tpl : tpl
			});
	view.on('selectionchange', onSelectionChange, this);

	var defaults = new Ext.Panel({
				animCollapse : false,
				baseCls : 'collapse-group',
				border : false,
				cls : 'pref-thumbnail-viewer',
				collapsible : true,
				hideCollapseTool : true,
				id : 'pref-theme-view',
				items : view,
				title : '\u9ed8\u8ba4\u4e3b\u9898',
				titleCollapse : true
			});

	var themes = new Ext.Panel({
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : true,
				cls : 'pref-card-subpanel',
				id : 'themes',
				items : defaults,
				margins : '10 15 0 15',
				region : 'center'
			});

	this.slider = createSlider({
				handler : new Ext.util.DelayedTask(updateTransparency, this),
				min : 0,
				max : 100,
				x : 15,
				y : 35,
				width : 100
			});

	var formPanel = new Ext.FormPanel({
				border : false,
				height : 70,
				items : [{
							x : 15,
							y : 15,
							xtype : 'label',
							text : '\u72b6\u6001\u680f\u900f\u660e\u5ea6'
						}, this.slider.slider, this.slider.display],
				layout : 'absolute',
				split : false,
				region : 'south'
			});

	Ext.util.QoPreferences.Appearance.superclass.constructor.call(this, {
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '\u4fdd\u5b58'//save
						}, {
							handler : onClose,
							scope : this,
							text : '\u5173\u95ed'//close
						}],
				cls : 'pref-card',
				id : config.id,
				items : [themes, formPanel],
				layout : 'border',
				title : '\u7cfb\u7edf\u4e3b\u9898'// Window Color And Appearance
			});

	// private functions
	function createSlider(config) {
		var handler = config.handler, min = config.min, max = config.max, width = config.width
				|| 100, x = config.x, y = config.y;

		var slider = new Ext.Slider({
					minValue : min,
					maxValue : max,
					width : width,
					x : x,
					y : y
				});

		var display = new Ext.form.NumberField({
					cls : 'pref-percent-field',
					enableKeyEvents : true,
					allowDecimals : false,
					maxValue : max,
					minValue : min,
					width : 45,
					x : x + width + 15,
					y : y - 1
				});

		function sliderHandler(slider) {
			var v = slider.getValue();
			display.setValue(v);
			handler.delay(100, null, null, [v]); // delayed task prevents IE
			// bog
		}

		slider.on({
					'change' : {
						fn : sliderHandler,
						scope : this
					},
					'drag' : {
						fn : sliderHandler,
						scope : this
					}
				});

		display.on({
					'keyup' : {
						fn : function(field) {
							var v = field.getValue();
							if (v !== '' && !isNaN(v) && v >= field.minValue
									&& v <= field.maxValue) {
								slider.setValue(v);
							}
						},
						buffer : 350,
						scope : this
					}
				});

		return {
			slider : slider,
			display : display
		}
	}

	function onClose() {
		goBack();//xiaoxiong 20100307
		this.owner.win.close();
	}

	function onSave() {
		var c = this.app.styles;
		beforeTheme = c.theme;//xiaoxiong 20100307
		beforeTransparency = c.transparency;//xiaoxiong 20100506
//		this.buttons[0].disable();
		this.owner.save({
			callback : function() {
				this.buttons[0].enable();
			},
			callbackScope : this,
			backgroundColor : c.backgroundColor,
			fontColor : c.fontColor,
//			theme : c.theme.id,
			themeId : c.theme.id,
			transparency : c.transparency,
//			wallpaper : c.wallpaper.id,
			wallpaperId : c.wallpaper.id,
			wallpaperPosition : c.wallpaperPosition
		});
	}
	
	//xiaoxiong 20100307 edit
	function goBack() {		
		if(!beforeTheme || !beforeTheme.id) return ;//wuxiaoxu add
		if (parseInt(beforeTheme.id)) {
				desktop.setTheme({
							id : beforeTheme.id,
							name : beforeTheme.name,
							pathFile : beforeTheme.pathFile
						});
		}
		desktop.setTransparency(beforeTransparency);//xiaoxiong 20100506
	}
//end

	function onSelectionChange(view, sel) {
		if (sel.length > 0) {
			var cId = this.app.styles.theme.id, r = view.getRecord(sel[0]), d = r.data;

			if (parseInt(cId) !== parseInt(r.id)) {
				if (r && r.id && d.name && d.pathFile) {
					desktop.setTheme({
								id : r.id,
								name : d.name,
								pathFile : d.pathFile
							});
				}
			}
		}
	}

	function updateTransparency(v) {
		desktop.setTransparency(v);
	}
};

Ext.extend(Ext.util.QoPreferences.Appearance, Ext.Panel, {
			afterRender : function() {
				Ext.util.QoPreferences.Appearance.superclass.afterRender.call(this);
				this.on('show', this.loadStore, this, {
							single : true
				});
			},
			loadStore : function() {
				this.store.load();
				this.slider.slider.setValue(this.app.styles.transparency);
			}
		});

Ext.util.QoPreferences.Background = function(config) {
	var beforeTheme;//wuxiaoxu add
	var beforeWallpaper;//xiaoxiong 20100307
	var beforeWallpaperposition;//xiaoxiong 20100506
	var beforeFontcolor;//xiaoxiong 20100506
	var beforeStyles;//xiaoxiong 20100506
	var beforeBackgroundColor;
	this.owner = config.owner;
	this.app = this.owner.app;

	var desktop = this.app.getDesktop();

	var store = new Ext.data.JsonStore({
				baseParams : {
//					method : 'getWallpapers',
					moduleId : this.owner.moduleId
				},
				fields : ['id', 'name', 'pathThumbNail', 'pathFile'],
				id : 'id',
				root : 'images',
				url : '/desktop/getWallpapers'
			});
	
	this.store = store;
	
	store.on('load', function(store, records) {
		if (records) {
			defaults.setTitle('\u9ed8\u8ba4\u4e3b\u9898 (' + records.length	+ ')');

			var id = this.app.styles.wallpaper.id;
			beforeWallpaper = this.app.styles.wallpaper;//xiaoxiong 20100307
			beforeWallpaperposition = this.app.styles.wallpaperPosition;//xiaoxiong 20100506
			beforeFontcolor = this.app.styles.fontColor;//xiaoxiong 20100506
			beforeStyles = this.app.styles;//xiaoxiong 20100506
			beforeBackgroundColor = this.app.styles.backgroundColor;
			if (id) {
				view.select('wallpaper-' + id);
			}
		}
	}, this);
			
	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="wallpaper-{id}">',
			'<div class="pref-view-thumb"><img src="{pathThumbNail}" title="{name}" /></div>',
			'<span>{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');

	var view = new Ext.DataView({
				autoHeight : true,
				cls : 'pref-thumnail-view',
				emptyText : 'No wallpapers to display',
				itemSelector : 'div.pref-view-thumb-wrap',
				loadingText : 'loading...',
				singleSelect : true,
				overClass : 'x-view-over',
				prepareData : function(data) {
					data.shortName = Ext.util.Format.ellipsis(data.name, 17);
					return data;
				},
				store : store,
				tpl : tpl
			});
	view.on('selectionchange', onSelectionChange, this);

	var defaults = new Ext.Panel({
				animCollapse : false,
				baseCls : 'collapse-group',
				border : false,
				cls : 'pref-thumbnail-viewer',
				collapsible : true,
				hideCollapseTool : true,
				id : 'pref-wallpaper-view',
				items : view,
				title : '\u9ed8\u8ba4\u684c\u9762',
				titleCollapse : true
			});

	var wallpapers = new Ext.Panel({
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : true,
				cls : 'pref-card-subpanel',
				id : 'wallpapers',
				items : defaults,
				margins : '10 15 0 15',
				region : 'center'
			});

	var wpp = this.app.styles.wallpaperPosition;
	var tileRadio = createRadio('tile', wpp == 'tile' ? true : false, 90, 40);
	var centerRadio = createRadio('center', wpp == 'center' ? true : false,
			200, 40);

	var position = new Ext.FormPanel({
		border : false,
		height : 140,
		id : 'position',
		items : [
			{
					border : false,
					items : {
						border : false,
						html : '\u5899\u7eb8\u663e\u793a\u65b9\u5f0f'
					},
					x : 15,
					y : 15
				}, 
					{
					border : false,
					items : {
						border : false,
						html : '<img class="bg-pos-tile" src="'
								+ Ext.BLANK_IMAGE_URL
								+ '" width="64" height="44" border="0" alt="" />'
					},
					x : 15,
					y : 40
				}, 
				tileRadio, 
					{
					border : false,
					items : {
						border : false,
						html : '<img class="bg-pos-center" src="'
								+ Ext.BLANK_IMAGE_URL
								+ '" width="64" height="44" border="0" alt="" />'
					},
					x : 125,
					y : 40
				}
				, centerRadio
				
				
				
				
				
				//wuxiaoxu test 20120811
				
				
				
//				, 
//					{
//					border : false,
//					items : {
//						border : false,
//						html : '\u684c\u9762\u80cc\u666f\u989c\u8272'
//					},
//					x : 245,
//					y : 15
//				}
//				, {
//					border : false,
//					/*
//					 * items: new Ext.ColorPalette({ listeners: { 'select': {
//					 * fn: onColorSelect , scope: this } } }),
//					 */
//					items : new Ext.Button({
//								handler : onChangeBgColor,
//								// menu: new Ext.ux.menu.ColorMenu(),
//								scope : this,
//								text : '\u989c\u8272'
//							}),
//					x : 245,
//					y : 40
//				}, {
//					border : false,
//					items : {
//						border : false,
//						html : '\u684c\u9762\u5b57\u4f53\u989c\u8272'
//					},
//					x : 425,
//					y : 15
//				}, {
//					border : false,
//					/*
//					 * items: new Ext.ColorPalette({ listeners: { 'select': {
//					 * fn: onFontColorSelect , scope: this } } }),
//					 */
//					items : new Ext.Button({
//								handler : onChangeFontColor,
//								scope : this,
//								text : '\u989c\u8272'
//							}),
//					x : 425,
//					y : 40
//
//				}
				
				//wuxiaoxu end 20120811
				
				
				],
		layout : 'absolute',
		region : 'south',
		split : false
	});

	Ext.util.QoPreferences.Background.superclass.constructor.call(this, {
		border : false,
		layout : 'border',
		buttons : [{
					handler : onSave,
					scope : this,
					text : '\u4fdd\u5b58'
				}, {
					handler : onClose,
					scope : this,
					text : '\u5173\u95ed'
				}],
		cls : 'pref-card',
		id : config.id,
		items : [ position,wallpapers],
		title : '\u684c\u9762\u80cc\u666f'
	});

	function createRadio(value, checked, x, y) {
		if (value) {
			radio = new Ext.form.Radio({
						name : 'position',
						inputValue : value,
						checked : checked,
						x : x,
						y : y
					});

			radio.on('check', togglePosition, radio);

			return radio;
		}
	}

	function onChangeBgColor() {
		var dialog = new Ext.ux.ColorDialog({
					border : false,
					closeAction : 'close',
					listeners : {
						'select' : {
							fn : onColorSelect,
							scope : this,
							buffer : 350
						}
					},
					manager : this.app.getDesktop().getManager(),
					resizable : false,
					title : '\u989c\u8272'
				});
//		dialog.show(this.app.styles.backgroundColor);
		dialog.show(this.app.styles.backgroundColor);
	}

	function onColorSelect(p, hex) {
		desktop.setBackgroundColor(hex);
	}

	function onChangeFontColor() {
		var dialog = new Ext.ux.ColorDialog({
					border : false,
					closeAction : 'close',
					listeners : {
						'select' : {
							fn : onFontColorSelect,
							scope : this,
							buffer : 350
						}
					},
					manager : this.app.getDesktop().getManager(),
					resizable : false,
					title : '\u989c\u8272'
				});
		dialog.show(this.app.styles.fontColor);
	}

	function onFontColorSelect(p, hex) {
		desktop.setFontColor(hex);
	}

	function onClose() {
		goBack();//xiaoxiong 20100307
		this.owner.win.close();
	}

	//xiaoxiong 20100307 edit
	function goBack() {	
		if(beforeTheme ) {
		}else{//wuxiaoxu add
			return ;
		}
		if (parseInt(beforeWallpaper.id)) {
				desktop.setWallpaper({
							id : beforeWallpaper.id,
							name : beforeWallpaper.name,
							pathFile : beforeWallpaper.pathFile
						});
		}
		desktop.setWallpaperPosition(beforeWallpaperposition);
		desktop.setFontColor(beforeFontcolor);
		desktop.setBackgroundColor(beforeBackgroundColor);
	}
//end

	function onSave() {
		var c = this.app.styles;
		beforeStyles = c;
		beforeWallpaper=c.wallpaper;
		beforeWallpaperposition = c.wallpaperPosition;
		beforeFontcolor = c.fontColor;
		beforeBackgroundColor = c.backgroundColor;
//		this.buttons[0].disable();
		//wuxiaoxu test
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					backgroundColor : c.backgroundColor,
					fontColor : c.fontColor,
//					theme : c.theme.id,
					themeId : c.theme.id,//wuxiaoxu 20130722 modify
					transparency : c.transparency,
//					wallpaper : c.wallpaper.id,
					wallpaperId : c.wallpaper.id,
//					wallpaperPosition : c.wallpaperPosition
					wallpaperPosition : c.wallpaperPosition
				});
				
	}

	function onSelectionChange(view, sel) {
		//wuxiaoxu 20120728 add set background
		
		if (sel.length > 0) {
			var cId = this.app.styles.wallpaper.id, r = view.getRecord(sel[0]), d = r.data;

			if (parseInt(cId) !== parseInt(r.id)) {
				if (r && r.id && d.name && d.pathFile) {
					desktop.setWallpaper({
								id : r.id,
								name : d.name,
								pathFile : d.pathFile
							});
				}
			}
		}
	}

	function togglePosition(field, checked) {
		if (checked === true) {
			desktop.setWallpaperPosition(field.inputValue);
		}
	}
};

Ext.extend(Ext.util.QoPreferences.Background, Ext.Panel, {
			afterRender : function() {
				Ext.util.QoPreferences.Background.superclass.afterRender
						.call(this);
				this.on('show', this.loadStore, this, {
							single : true
						});
			},
			loadStore : function() {
				this.store.load();
			}
		});

/*
 * Will ensure that the checkchange event is fired on node double click
 */
Ext.override(Ext.tree.TreeNodeUI, {
			toggleCheck : function(value) {
				var cb = this.checkbox;
				if (cb) {
					cb.checked = (value === undefined ? !cb.checked : value);
					this.fireEvent('checkchange', this.node, cb.checked);
				}
			}
		});