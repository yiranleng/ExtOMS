/**
 * @author liukaiyuan liukayuan@flyingsoft.cn
 */

Ext.namespace("Ext.ux");

Ext.ux.Shortcuts = function(config) {
	var desktopEl = Ext.get(config.renderTo), taskbarEl = config.taskbarEl, btnHeight = 74, btnWidth = 64, btnPadding = 15, col = null, row = null, items = [];

	initColRow();

	function initColRow() {
		col = {
			index : 1,
			x : btnPadding
		};
		row = {
			index : 1,
			y : btnPadding
		};
	}

	function isOverflow(y) {
		if (y > (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight())) {
			return true;
		}
		return false;
	}

	this.addShortcut = function(config) {
		
		
		if(Ext.getCmp(config.id)){
			Ext.Msg.alert('\u6d88\u606f','\u5feb\u6377\u65b9\u5f0f\u5df2\u5b58\u5728');
			return;
		}
		var div = desktopEl.createChild({
					tag : 'div',
					id:config.id,//wuxiaoxu 20120728 add id
					cls : 'ux-shortcut-item'
		});//wuxiaoxu xiugaile ',' to ';'
		btn = new Ext.ux.ShortcutButton(this, Ext.apply(config, {
			text : Ext.util.Format.ellipsis(config.text, 16)
		}), div);
		
		
		
		
		//alert('Shortcut:43' + div.id);

		//btn.container.initDD('DesktopShortcuts');

		items.push(btn);
		this.setXY(btn.container);

		return btn;
	};

	this.removeShortcut = function(b) {
		var d = document.getElementById(b.container.id);
		b.destroy();
		d.parentNode.removeChild(d);

		var s = [];
		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i] != b) {
				s.push(items[i]);
			}
		}
		items = s;

		this.handleUpdate();
	}

	this.handleUpdate = function() {
		initColRow();
		for (var i = 0, len = items.length; i < len; i++) {
			this.setXY(items[i].container);
		}
	}

	this.setXY = function(item) {
		var bottom = row.y + btnHeight, overflow = isOverflow(row.y + btnHeight);

		if (overflow && bottom > (btnHeight + btnPadding)) {
			col = {
				index : col.index++,
				x : col.x + btnWidth + btnPadding
			};
			row = {
				index : 1,
				y : btnPadding
			};
		}

		item.setXY([col.x, row.y]);

		row.index++;
		row.y = row.y + btnHeight + btnPadding;
	};

	Ext.EventManager.onWindowResize(this.handleUpdate, this, {delay : 500});
};

/**
 * @class Ext.ux.ShortcutButton
 * @extends Ext.Button
 */
Ext.ux.ShortcutButton = function(p, config, el) {
	this.par = p;
	Ext.ux.ShortcutButton.superclass.constructor.call(this, Ext.apply(config, {
				renderTo : el,
				// clickEvent: 'dblclick',
				template : new Ext.Template(
						'<div class="ux-shortcut-btn"><div>', '<img src="'
								+ Ext.BLANK_IMAGE_URL + '" /></div>',
						'<div class="ux-shortcut-btn-text">{0}</div>', '</div>')
			}));

};

Ext.extend(Ext.ux.ShortcutButton, Ext.Button,  {

	buttonSelector : 'div:first',

	onRender : function() {
		Ext.ux.ShortcutButton.superclass.onRender.apply(this, arguments);
//		var elId = this.el.id;
		var elId = this.id;//wuxiaoxu 20120728 modify
		var shortcut = this;
		this.handler = function() {
			var module = Ext.getCmp(elId.replace('-shortcut', ''));
			if (module) {
				module.fireEvent('click', module);
			}
		}
		
		//wuxiaoxu delete shijian
		this.el.on('contextmenu', function(e, t) {
			e.stopEvent();
			var cmenu = new Ext.menu.Menu({
						items : [{
							text : '\u5220\u9664\u684c\u9762\u5feb\u6377',
							iconCls : 'remove',
							handler : function() {
								Ext.Ajax.request({
									url : '/desktop/deleteShortcut',
									params : {
										menuName : elId.replace('-shortcut', '')
									},
									success : function() {
										shortcut.par.removeShortcut(shortcut);
									}
								});
							}
						}]
					})
			cmenu.showAt(e.getXY());
		}, this);
	},

	initButtonEl : function(btn, btnEl) {
		Ext.ux.ShortcutButton.superclass.initButtonEl.apply(this, arguments);

		btn.removeClass("x-btn");

		if (this.iconCls) {
			if (!this.cls) {
				btn.removeClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
			}
		}
	},

	autoWidth : function() {
		// do nothing
	},

	/**
	 * Sets this shortcut button's text
	 * 
	 * @param {String}
	 *            text The button text
	 */
	setText : function(text) {
		this.text = text;
		if (this.el) {
			this.el.child("div.ux-shortcut-btn-text").update(text);
		}
	}
});