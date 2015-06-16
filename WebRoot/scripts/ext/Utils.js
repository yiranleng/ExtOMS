// version 3.0.2
Ext.ux.Multiselect = Ext.extend(Ext.form.Field, {
	store : null,
	dataFields : [],
	data : [],
	width : 100,
	height : 100,
	displayField : 0,
	valueField : 1,
	allowBlank : true,
	minLength : 0,
	maxLength : Number.MAX_VALUE,
	blankText : Ext.form.TextField.prototype.blankText,
	minLengthText : 'Minimum {0} item(s) required',
	maxLengthText : 'Maximum {0} item(s) allowed',
	copy : false,
	allowDup : false,
	allowTrash : false,
	legend : null,
	focusClass : undefined,
	delimiter : ',',
	view : null,
	dragGroup : null,
	dropGroup : null,
	tbar : null,
	appendOnly : false,
	sortField : null,
	sortDir : 'ASC',
	dbclick : true,// wuxiaoxu
	type : '',// wuxiaoxu
	functionName : '',
	defaultAutoCreate : {
		tag : "div"
	},

	initComponent : function() {
		Ext.ux.Multiselect.superclass.initComponent.call(this);
		this.addEvents({
					'dblclick' : true,
					'click' : true,
					'change' : true,
					'drop' : true
				});
		var father = this;
		var width = father.width;
		this.tbar = new Ext.Toolbar({
					width : width - 5,
					items : [new Ext.form.TextField({
								enableKeyEvents : true,
								width : width - 10,
								listeners : {
									'keyup' : function(f, e) {
										if (e.getKey() == e.ENTER) {
											return;
										}
										var val = f.getRawValue();
										var store = father.view.store;
										store.clearFilter();
										if (val == '') {
											father.view.clearSelections();
											return;
										}
										// store.filter('display',val);
										store.filter('display', val, true,
												false); // dengfeng
														// 字段选择标签页检索字段名时检索不准确的bug
														// 20110503 add
										var num = store.find('display', val);
										if (num == -1) {
											return;
										}
										father.view.select(num);
									},
									'keypress' : function(f, e) {
										if (e.getKey() == e.ENTER) {
											var selIndex = father.view
													.getSelectedIndexes()[0]
													+ 1;
											var index = selIndex == father.view.store
													.getCount() ? 0 : selIndex;
											father.view.select(index);
										}
									}
								}
							})]

				});
	},
	onRender : function(ct, position) {
		var fs, cls, tpl;
		Ext.ux.Multiselect.superclass.onRender.call(this, ct, position);

		cls = 'ux-mselect';

		fs = new Ext.form.FieldSet({
					renderTo : this.el,
					title : this.legend,
					height : this.height,
					width : this.width,
					style : "padding:1px;",
					tbar : this.tbar
				});
		if (!this.legend)
			fs.el.down('.' + fs.headerCls).remove();
		fs.body.addClass(cls);

		tpl = '<tpl for="."><div class="' + cls + '-item';
		if (Ext.isIE || Ext.isIE7)
			tpl += '" unselectable=on';
		else
			tpl += ' x-unselectable"';
		tpl += '>{' + this.displayField + '}</div></tpl>';

		if (!this.store) {
			this.store = new Ext.data.SimpleStore({
						fields : this.dataFields,
						data : this.data
					});
		}

		this.view = new Ext.ux.DDView({
					multiSelect : true,
					store : this.store,
					selectedClass : cls + "-selected",
					tpl : tpl,
					allowDup : this.allowDup,
					copy : this.copy,
					allowTrash : this.allowTrash,
					dragGroup : this.dragGroup,
					dropGroup : this.dropGroup,
					itemSelector : "." + cls + "-item",
					isFormField : false,
					applyTo : fs.body,
					appendOnly : this.appendOnly,
					sortField : this.sortField,
					sortDir : this.sortDir,
					dbclick : this.dbclick,// wuxiaoxu
					type : this.type,
					dragDisabled : this.type == 'to' ? true : false,
					functionName : this.functionName,
					listeners : {// wuxiaoxu 当被选中时，自动滚动
						'selectionchange' : function(t, node) {
							if (!(node = node[0]))
								return;
							var ct = this.el.dom, barHeight = 0, diff;
							var ctSt = ct.scrollTop, nodeOft = node.offsetTop;
							if (ct.offsetHeight - ct.clientHeight > 5) {
								barHeight = 16;
							}
							var cntPos = [ctSt,
									ctSt + ct.offsetHeight - barHeight];
							var nodePos = [nodeOft, nodeOft + node.offsetHeight];
							if (nodePos[0] < cntPos[0]) {
								ct.scrollTop = nodeOft;
							}
							if ((diff = nodePos[1] - cntPos[1]) > 0) {
								ct.scrollTop = ctSt + diff + 2;
							}
						}
					}
				});

		this.view.on('click', this.onViewClick, this);
		this.view.on('beforeClick', this.onViewBeforeClick, this);
		if (this.dbclick) {
			this.view.on('dblclick', this.onViewDblClick, this);
		}
		this.view.on('drop', function(ddView, n, dd, e, data) {
					return this.fireEvent("drop", ddView, n, dd, e, data);
				}, this);

		this.hiddenName = this.name;
		var hiddenTag = {
			tag : "input",
			type : "hidden",
			value : "",
			name : this.name
		};
		if (this.isFormField) {
			this.hiddenField = this.el.createChild(hiddenTag);
		} else {
			this.hiddenField = Ext.get(document.body).createChild(hiddenTag);
		}
		fs.doLayout();
	},

	initValue : Ext.emptyFn,

	onViewClick : function(vw, index, node, e) {
		var arrayIndex = this.preClickSelections.indexOf(index);
		if (arrayIndex != -1) {
			this.preClickSelections.splice(arrayIndex, 1);
			this.view.clearSelections(true);
			this.view.select(this.preClickSelections);
		}
		this.fireEvent('change', this, this.getValue(),
				this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);// wuxiaoxu
		this.validate();
	},

	onViewBeforeClick : function(vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
		if (this.disabled) {
			return false;
		}
	},

	onViewDblClick : function(vw, index, node, e) {
		return this.fireEvent('dblclick', vw, index, node, e);
	},

	getValue : function(valueField) {
		var returnArray = [];
		var selectionsArray = this.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return '';
		}
		for (var i = 0; i < selectionsArray.length; i++) {
			returnArray
					.push(this.store.getAt(selectionsArray[i])
							.get(((valueField != null)
									? valueField
									: this.valueField)));
		}
		return returnArray.join(this.delimiter);
	},

	setValue : function(values) {
		var index;
		var selections = [];
		this.view.clearSelections();
		this.hiddenField.dom.value = '';

		if (!values || (values == '')) {
			return;
		}

		if (!(values instanceof Array)) {
			values = values.split(this.delimiter);
		}
		for (var i = 0; i < values.length; i++) {
			index = this.view.store.indexOf(this.view.store.query(
					this.valueField, new RegExp('^' + values[i] + '$', "i"))
					.itemAt(0));
			selections.push(index);
		}
		this.view.select(selections);
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	},

	reset : function() {
		this.setValue('');
	},

	getRawValue : function(valueField) {
		var tmp = this.getValue(valueField);
		if (tmp.length) {
			tmp = tmp.split(this.delimiter);
		} else {
			tmp = [];
		}
		return tmp;
	},

	setRawValue : function(values) {
		setValue(values);
	},

	validateValue : function(value) {
		if (value.length < 1) { // if it has no value
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			} else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if (value.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if (value.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		return true;
	},

	onDestroy : function() {
		if (this.view) {
			this.view.destroy();
		}
		if (this.hiddenField) {
			this.hiddenField.remove();
		}
		if (this.tbar) {
			this.tbar.destroy;
		}
		Ext.ux.Multiselect.superclass.onDestroy.call(this);
		// Ext.destroy(this);
	},

	onEnable : function() {
		this.el.unmask();
	},

	onDisable : function() {
		this.el.mask();
	}

});

Ext.reg("multiselect", Ext.ux.Multiselect);

Ext.ux.ItemSelector = Ext.extend(Ext.form.Field, {
	msWidth : 200,
	msHeight : 300,
	hideNavIcons : false,
	imagePath : "images/",
	iconUp : "up2.gif",
	iconDown : "down2.gif",
	iconLeft : "left2.gif",
	iconRight : "right2.gif",
	iconTop : "top2.gif",
	iconBottom : "bottom2.gif",
	iconAsc : "icon-asc.gif",// wuxiaoxu
	iconDesc : "icon-desc.gif",// wuxiaoxu
	iconCustomSort : "customSort.gif",// wangjie
	iconFilePath : "filePath.png",// wuxiaoxu 20100428
	drawUpIcon : true,
	drawDownIcon : true,
	drawLeftIcon : true,
	drawRightIcon : true,
	drawTopIcon : true,
	drawBotIcon : true,
	drawAsc : false,// wuxiaoxu
	drawDesc : false,// wuxiaoxu
	drawCustomSort : false,// wangjie
	drawZero : false,// wuxiaoxu
	validateToFrom : false,// xiaoxiong 20100812
	filedLengthArray : null,// zhangwenbin 20100706
	drawCombin : false,// wuxiaoxu
	drawScan : false,// wuxiaoxu
	fromStore : null,
	toStore : null,
	fromData : null,
	toData : null,
	displayField : 0,
	valueField : 1,
	switchToFrom : false,
	allowDup : false,
	focusClass : undefined,
	delimiter : ',',
	readOnly : false,
	toLegend : null,
	fromLegend : null,
	toSortField : null,
	fromSortField : null,
	toSortDir : 'ASC',
	fromSortDir : 'ASC',
	toTBar : null,
	fromTBar : null,
	bodyStyle : null,
	border : false,
	type : '',
	funcionName : '',// wuxiaoxu

	defaultAutoCreate : {
		tag : "div"
	},

	initComponent : function() {
		Ext.ux.ItemSelector.superclass.initComponent.call(this);
		this.addEvents({
					'rowdblclick' : true,
					'change' : true
				});
	},
	// wuxiaoxu
	onRender : function(ct, position) {
		if (this.type == 'sort') {
			this.drawLeftIcon = false;
			this.drawAsc = true;
			this.drawDesc = true;
			this.drawCustomSort = true;// wangjie
		} else if (this.type == 'zero') {
			this.drawZero = true;
		} else if (this.type == 'combin') {
			this.drawCombin = true;
		} else if (this.type == 'scan') {
			this.drawScan = true;
			// xiaoxiong 20100812 add
		} else if (this.type == 'validateToFrom') {
			this.validateToFrom = true;
		}
		// wuxiaoxu end
		Ext.ux.ItemSelector.superclass.onRender.call(this, ct, position);
		this.fromMultiselect = new Ext.ux.Multiselect({
			legend : this.fromLegend,
			delimiter : this.delimiter,
			allowDup : this.allowDup,
			copy : this.allowDup,
			allowTrash : this.allowDup,
			dragGroup : this.readOnly ? null : "drop2-" + this.el.dom.id,
			dropGroup : this.readOnly ? null : "drop1-" + this.el.dom.id,
			// + ",drop1-" + this.el.dom.id,
			width : this.msWidth,
			height : this.msHeight,
			dataFields : this.dataFields,
			data : this.fromData,
			displayField : this.displayField,
			valueField : this.valueField,
			store : this.fromStore,
			isFormField : false,
			tbar : this.fromTBar,
			appendOnly : true,
			type : this.drawScan == true
					? 'scanToFrom'
					: (this.drawCombin == true
							? 'combinToFrom'
							: ((this.functionName != '' && this.functionName != undefined)
									? 'toFrom'
									: ((this.type == 'zero')
											? 'from'
											: (this.type == 'sort')
													? 'fromsort'
													: (this.type == 'validateToFrom')
															? 'validateToFrom'
															: ''))),// xiaoxiong
																	// 20100812
																	// add
																	// validateToFrom
			sortField : this.fromSortField,
			sortDir : this.fromSortDir,
			functionName : this.functionName,
			dbclick : (this.type == 'sort' || this.type == 'zero')
					? false
					: true
				// wuxiaoxu
		});

		// if (this.type == 'sort' || this.type == 'zero') {
		// alert("==================="+this.toMultiselect);
		// this.fromMultiselect.on('click', this.onclick, this);// wangjie
		// } else {
		// this.fromMultiselect.on('dblclick', this.onRowDblClick, this);
		// }
		//
		if (!this.toStore) {
			this.toStore = new Ext.data.SimpleStore({
						fields : this.dataFields,
						data : this.toData
					});
		}
		this.toStore.on('add', this.valueChanged, this);
		this.toStore.on('remove', this.valueChanged, this);
		this.toStore.on('load', this.valueChanged, this);
		this.toMultiselect = new Ext.ux.Multiselect({
			legend : this.toLegend,
			delimiter : this.delimiter,
			allowDup : this.allowDup,
			dragGroup : this.readOnly ? null : "drop1-" + this.el.dom.id,
			dropGroup : this.readOnly ? null : "drop2-" + this.el.dom.id,
			// + ",drop1-" + this.el.dom.id,
			width : this.msWidth,
			height : this.msHeight,
			displayField : this.displayField,
			valueField : this.valueField,
			store : this.toStore,
			isFormField : false,
			type : this.drawScan == true
					? 'scanFromTo'
					: (this.drawCombin == true
							? 'combinFromTo'
							: ((this.functionName != '' && this.functionName != undefined)
									? 'fromTo'
									: ((this.type == 'sort' || this.type == 'zero')
											? 'to'
											: ''))),// wuxiaoxu
			tbar : this.toTBar,
			sortField : this.toSortField,
			sortDir : this.toSortDir,
			functionName : this.functionName
				// dbclick:(this.drawAsc==true&&this.drawDesc==true)?false:true
				// //wuxiaoxu
		});

		if (this.type == 'sort' || this.type == 'zero' || this.type == 'scan') {
			// alert("111111s11 "+this.toMultiselect);
			// alert("111111111 "+this.toMultiselect.view.getSelectedIndexes());
			this.fromMultiselect.on('click', this.onclick, this);// wangjie
		} else {
			this.fromMultiselect.on('dblclick', this.onRowDblClick, this);
		}

		// if (!this.toStore) {
		// this.toStore = new Ext.data.SimpleStore({
		// fields : this.dataFields,
		// data : this.toData
		// });
		// }
		// wuxiaoxu
		// if (this.drawAsc || this.drawDesc) {
		// } else {
		this.toMultiselect.on('dblclick', this.onRowDblClick, this);
		// }

		var p = new Ext.Panel({
					bodyStyle : this.bodyStyle,
					border : this.border,
					layout : "table",
					layoutConfig : {
						columns : 3
					}
				});
		// new Ext.form.Field({fieldLabel:'aa' })
		// p.add({layout:'column',items:[{columnWidth:0.3,xtype:'field'}]});
		p.add(this.switchToFrom ? this.toMultiselect : this.fromMultiselect);
		var icons = new Ext.Panel({
					header : false,
					style : 'text-align:center'
				});
		p.add(icons);
		p.add(this.switchToFrom ? this.fromMultiselect : this.toMultiselect);
		// p.add({layout:'column',items:[(this.switchToFrom ? this.toMultiselect
		// : this.fromMultiselect),icons,(this.switchToFrom ?
		// this.fromMultiselect : this.toMultiselect)]});
		p.render(this.el);
		icons.el.down('.' + icons.bwrapCls).remove();

		if (this.imagePath != ""
				&& this.imagePath.charAt(this.imagePath.length - 1) != "/")
			this.imagePath += "/";
		this.iconUp = this.imagePath + (this.iconUp || 'up2.gif');
		this.iconDown = this.imagePath + (this.iconDown || 'down2.gif');
		this.iconLeft = this.imagePath + (this.iconLeft || 'left2.gif');
		this.iconRight = this.imagePath + (this.iconRight || 'right2.gif');
		this.iconTop = this.imagePath + (this.iconTop || 'top2.gif');
		this.iconBottom = this.imagePath + (this.iconBottom || 'bottom2.gif');
		this.iconAsc = this.imagePath + (this.iconAsc || 'icon-asc.gif');// wuxiaoxu
		this.iconDesc = this.imagePath + (this.iconDesc || 'icon-desc.gif');// wuxiaoxu
		// this.iconCustomSort = this.imagePath +
		// (this.iconCustomSort||'icon-desc.gif');;// wuxiaoxu

		this.iconCustomSort = this.imagePath
				+ (this.iconCustomSort || 'icon-customSort.gif');// wangjie
		this.iconFilePath = this.imagePath
				+ (this.iconFilePath || 'filePath.png');// wuxiaoxu
		var el = icons.getEl();

		// wuxiaoxu
		if (this.drawZero) {
			el.createChild({
						tag : 'var',
						html : '\u957f\u5ea6:',
						style : {
							'font-size' : '12px'
						}
					});
			this.zeroField = el.createChild({
				tag : 'input',
				onkeyup : "var reg=/[^2-9]|[2-9]{2,}/;if(reg.test(this.value)){Ext.Msg.alert('提示','请输入一个大于1小于10的整数');this.focus();this.value=this.value.replace(reg,'');}",
				style : {
					width : '20px'
				}

			});
			el.createChild({
						tag : 'br'
					});
		}
		// wuxiaoxu
		if (this.drawScan) {
			el.createChild({
						tag : 'var',
						html : '\u8fde\u63a5\u7b26',
						style : {
							'font-size' : '12px'
						}
					});
			this.scanCom = el.createChild({
						tag : 'input',
						value : '-',
						style : {
							width : '50px'
						}

					});
			this.scanConnectIcon = el.createChild({
						tag : 'img',
						src : this.iconRight,
						style : {
							cursor : 'pointer',
							margin : '1px'
						}
					});
			this.scanPathIcon = el.createChild({
						tag : 'img',
						src : this.iconFilePath,
						title : '\u8bbe\u7f6e\u8def\u5f84\u8fde\u63a5\u7b26',
						style : {
							cursor : 'pointer',
							margin : '1px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		// wuxiaoxu
		if (this.drawCombin) {
			el.createChild({
						tag : 'var',
						html : '\u8fde\u63a5\u7b26',
						style : {
							'font-size' : '12px'
						}
					});
			this.combinField = el.createChild({
						tag : 'input',
						style : {
							width : '20px'
						}

					});
			this.connectIcon = el.createChild({
						tag : 'img',
						src : this.iconRight,
						style : {
							cursor : 'pointer',
							margin : '1px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		if (!this.toSortField) {
			if (this.drawTopIcon) {
				this.toTopIcon = el.createChild({
							tag : 'img',
							src : this.iconTop,
							style : {
								cursor : 'pointer',
								margin : '2px'
							}
						});
				el.createChild({
							tag : 'br'
						});
			}
			if (this.drawUpIcon) {
				this.upIcon = el.createChild({
							tag : 'img',
							src : this.iconUp,
							style : {
								cursor : 'pointer',
								margin : '2px'
							}
						});
				el.createChild({
							tag : 'br'
						});
			}
		}
		if (this.drawLeftIcon) {
			this.addIcon = el.createChild({
						tag : 'img',
						src : this.switchToFrom
								? this.iconLeft
								: this.iconRight,
						style : {
							cursor : 'pointer',
							margin : '2px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		if (this.drawRightIcon) {
			this.removeIcon = el.createChild({
						tag : 'img',
						src : this.switchToFrom
								? this.iconRight
								: this.iconLeft,
						style : {
							cursor : 'pointer',
							margin : '2px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		// wuxiaoxu add
		if (this.drawAsc) {
			this.ascIcon = el.createChild({
						tag : 'img',
						src : this.iconAsc,
						style : {
							cursor : 'pointer',
							margin : '2px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		if (this.drawDesc) {
			this.descIcon = el.createChild({
						tag : 'img',
						src : this.iconDesc,
						style : {
							cursor : 'pointer',
							margin : '2px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		// wangjie 2010
		if (this.drawCustomSort) {
			this.drawCustomSortIcon = el.createChild({
						tag : 'img',
						src : this.iconCustomSort,
						style : {
							cursor : 'pointer',
							margin : '2px'
						}
					});
			el.createChild({
						tag : 'br'
					});
		}
		// wuxiaoxu add end
		if (!this.toSortField) {
			if (this.drawDownIcon) {
				this.downIcon = el.createChild({
							tag : 'img',
							src : this.iconDown,
							style : {
								cursor : 'pointer',
								margin : '2px'
							}
						});
				el.createChild({
							tag : 'br'
						});
			}
			if (this.drawBotIcon) {
				this.toBottomIcon = el.createChild({
							tag : 'img',
							src : this.iconBottom,
							style : {
								cursor : 'pointer',
								margin : '2px'
							}
						});
			}
		}
		if (!this.readOnly) {
			if (!this.toSortField) {
				if (this.drawTopIcon) {
					this.toTopIcon.on('click', this.toTop, this);
				}
				if (this.drawUpIcon) {
					this.upIcon.on('click', this.up, this);
				}
				if (this.drawDownIcon) {
					this.downIcon.on('click', this.down, this);
				}
				if (this.drawBotIcon) {
					this.toBottomIcon.on('click', this.toBottom, this);
				}
			}
			if (this.drawLeftIcon) {
				this.addIcon.on('click', this.fromTo, this);
			}
			if (this.drawRightIcon) {
				this.removeIcon.on('click', this.toFrom, this);
			}
			// wangjie 2010 ?
			if (this.drawCustomSort) {

				this.drawCustomSortIcon.on('click', this.toCustomSort, this);
			}
			if (this.drawAsc) {
				this.ascIcon.on('click', this.toAsc, this);
			}
			if (this.drawDesc) {
				this.descIcon.on('click', this.toDesc, this);
			}// this.connectIcon
			if (this.drawCombin) {
				this.connectIcon.on('click', this.connTo, this);
			}
			if (this.drawScan) {
				this.scanConnectIcon.on('click', this.sacnConnTo, this);
				this.scanPathIcon.on('click', this.scanPathTo, this);
			}
		}
		// if (!this.drawUpIcon || this.hideNavIcons) {
		// this.upIcon.dom.style.display = 'none';
		// }
		// if (!this.drawDownIcon || this.hideNavIcons) {
		// this.downIcon.dom.style.display = 'none';
		// }
		// if (!this.drawLeftIcon || this.hideNavIcons) {
		// this.addIcon.dom.style.display = 'none';
		// }
		// if (!this.drawRightIcon || this.hideNavIcons) {
		// this.removeIcon.dom.style.display = 'none';
		// }
		// if (!this.drawTopIcon || this.hideNavIcons) {
		// this.toTopIcon.dom.style.display = 'none';
		// }
		// if (!this.drawBotIcon || this.hideNavIcons) {
		// this.toBottomIcon.dom.style.display = 'none';
		// }
		// if (!this.drawAsc || this.hideNavIcons) {
		// this.toAscIcon.dom.style.display = 'none';
		// }// wuxiaoxu
		// if (!this.drawDesc || this.hideNavIcons) {
		// this.toDescIcon.dom.style.display = 'none';
		// }// wuxiaoxu

		var tb = p.body.first();
		this.el.setWidth(p.body.first().getWidth());
		p.body.removeClass();

		this.hiddenName = this.name;
		var hiddenTag = {
			tag : "input",
			type : "hidden",
			value : "",
			name : this.name
		};
		this.hiddenField = this.el.createChild(hiddenTag);
		this.valueChanged(this.toStore);
	},

	initValue : Ext.emptyFn,

	// wangjie 2010
	toCustomSort : function() {
		// 20101007
		var v = 0;
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		if (this.disabled || selectionsArray.length == 0)
			return;

		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				v = this.fromMultiselect.view.store.getAt(selectionsArray[i]).data.value;
				break;

			}

		}
		// 对应弹出来的对话框中的关键字
		key = '';

		new Ext.Window({
			title : '添加',
			modal : true,
			id : 'listArchiveModel_checkUpEditWin',
			width : 400,
			height : 180,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			testValue : "",
			testValue2 : "",
			testObject : "",
			items : new Ext.form.FormPanel({
						id : 'listArchiveModel_checkUpEditform',
						baseCls : 'x-plain',
						labelWidth : 55,
						defaultType : 'textfield',
						items : [{
									id : 'listArchiveModelfieldCode',
									fieldLabel : '排序字段',
									name : 'propValue',
									allowBlank : false,
									value : '',
									disabled : 'true',
									anchor : '90%',
									value : v
								}, {
									fieldLabel : '关键字',
									name : 'keyValue',
									value : '',
									anchor : '90%',
									id : 'keyValue',
									allowBlank : false, // dengwng 20110331 add
														// 增加关键字为空时的提示验证
									blankText : '关键字不能为空！' // dengfeng 20110331
															// add 增加关键字为空时的提示验证
									// regex:/^([ ]*[^
									// %',!@#$&~`^:.*{}|?/()<>\[\]\+\-\;\"_=\\]+[
									// ]*)*$/,
								// regexText:'不能全部为空格且不允许输入特殊字符！',
								/* allowBlank : false */
							}]
					}),

			buttons : [{
				text : '保存',
				handler : function() {
					// wangjie 增加对特殊字符的判定
					if (Ext.getCmp('listArchiveModel_checkUpEditform')
							.getForm().isValid()) {
						this.testValue = key = Ext.getCmp('keyValue')
								.getValue();
						objectTmp = Ext
								.getCmp('listArchiveModel_checkUpEditWin').testObject;
						var recorder = new Ext.data.Record({
							'value' : Ext
									.getCmp('listArchiveModel_checkUpEditWin').testValue2
									+ '|' + this.testValue,
							'display' : Ext
									.getCmp('listArchiveModel_checkUpEditWin').testValue2
									+ '|' + this.testValue
						});
						objectTmp.view.store.add(recorder);
						// this.toMultiselect=objectTmp.view.store;
						this.toMultiselect = objectTmp.view.store.getRange(0,
								objectTmp.view.store.getTotalCount() - 1);
						// alert(this.toMultiselect.view);
						Ext.getCmp('listArchiveModel_checkUpEditWin').close();
					} else {
						Ext.Msg.alert('消息', '关键字不能为空！'); // dengfeng 20110331
															// add 增加关键字为空时的提示验证
					}
				}

			}, {
				text : '返回',
				handler : function() {
					Ext.getCmp('listArchiveModel_checkUpEditWin').close();
				}
			}]
		});
		Ext.getCmp('listArchiveModel_checkUpEditWin').show();
		Ext.getCmp('listArchiveModel_checkUpEditWin').testObject = this.toMultiselect;

		// wangjie
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		if (this.disabled || selectionsArray.length == 0)
			return;
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			if (!this.allowDup)
				selectionsArray = [];
			for (var i = 0; i < records.length; i++) {
				record = records[i];
				if (this.allowDup) {
					Ext.getCmp('listArchiveModel_checkUpEditWin').testValue2 = record.data.value;
				} else {
					// var record1=record;
					// this.fromMultiselect.view.store.remove(record);---2010
					// 0113

					Ext.getCmp('listArchiveModel_checkUpEditWin').testValue2 = record.data.value;
					selectionsArray.push((this.toMultiselect.view.store
							.getCount() - 1));
				}
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
	},
	toTop : function() {
		if (this.disabled)
			return;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i = records.length - 1; i > -1; i--) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.insert(0, record);
				selectionsArray.push(((records.length - 1) - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},
	// wuxiaoxu add
	connTo : function() {
		if (this.disabled)
			return;
		var combinValue = this.combinField.getValue();
		var selectionsArray = [];
		if (combinValue.length > 0) {
			// shilongfei 2010111115 增加字符判断 add  ninglong20110808 应张姐要求 add  '  " /
			//if (combinValue.indexOf("'") >= 0|| combinValue.indexOf("\"") >= 0) {
				//再次根据张姐要求去掉反斜杠和竖杠 ninglong20110920 edit
			if (combinValue.indexOf("\\") >= 0 || combinValue.indexOf("|") >= 0|| combinValue.indexOf("'") >= 0|| combinValue.indexOf("\"") >= 0|| combinValue.indexOf("/") >= 0) {
				Ext.Msg.alert('友情提示', '连接符不能设置英文的单引号、双引号、斜杠、反斜杠！');
				return;
			}
			// shilongfei 20101115 end
			var x = new Ext.data.Record({
						'value' : combinValue + '|false',
						'display' : combinValue + '|false'
					});
			// record.id = x.id;
			// delete x;
			// x.data.value = combinValue + '|false';
			// x.data.display = combinValue + '|false';
			this.toMultiselect.view.store.add(x);
			selectionsArray
					.push((this.toMultiselect.view.store.getCount() - 1));
		}
		this.toMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		this.toMultiselect.view.select(selectionsArray);
	},
	// wuxiaoxu add
	sacnConnTo : function() {
		if (this.disabled)
			return;
		var scanComValue = this.scanCom.getValue();
		var selectionsArray = [];
		if (scanComValue.length > 0) {
			var x = new Ext.data.Record({
						'value' : scanComValue + '|CONNECTOR',
						'display' : scanComValue + '|CONNECTOR'
					});
			this.toMultiselect.view.store.add(x);
			selectionsArray
					.push((this.toMultiselect.view.store.getCount() - 1));
		}
		this.toMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		this.toMultiselect.view.select(selectionsArray);
	},
	scanPathTo : function() {
		if (this.disabled)
			return;
		var selectionsArray = [];

		var x = new Ext.data.Record({
					'value' : '/|PATH',
					'display' : '/|PATH'
				});
		this.toMultiselect.view.store.add(x);
		selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));

		this.toMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		this.toMultiselect.view.select(selectionsArray);
	},
	// wuxiaoxu add Field
	toAsc : function() {
		if (this.disabled)
			return;
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		// alert("------------------"+this.toMultiselect.view.store.getCount());
		// for(var i=0;this.toMultiselect.view.store.getCount();i++){
		// record=this.toMultiselect.view.store.getAt(i);
		// records.push(record);
		// }
		// for(var i=0;i<records.length;i++){
		//			
		// }
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			// data.records.push(this.store.getAt(i));
			if (!this.allowDup) {

				selectionsArray = [];
				for (var j = 0; j < records.length; j++) {
					var record = records[j];
					// alert("===============for=============="+
					// record.data.value);
					// alert("count-------"+
					// this.toMultiselect.view.store.getCount());
					var flag = 0;
					for (var m = 0; m < this.toMultiselect.view.store
							.getCount(); m++) {
						var record1 = this.toMultiselect.view.store.getAt(m);
						// alert("record1--------------" + record1);
						// wuxiaoxu 原来此处赋值错误 2010008
						// record1.data.value = record1.data.value.slice(0,
						// record1.data.value.indexOf('|'));
						// alert("-------------for--------" +
						// record1.data.value);

						if (record1.data.value.slice(0, record1.data.value
										.indexOf('|')) == record.data.value) {
							// alert("---------------if----------------");
							flag = 1;
						}
					}
					if (flag == 0) {
						if (this.allowDup) {

							var x = new Ext.data.Record();
							record.id = x.id;
							delete x;
							record.data.value = record.data.value + '|ASC';
							record.data.display = record.data.display + '|ASC';
							this.toMultiselect.view.store.add(record);
						} else {
							this.fromMultiselect.view.store.remove(record);
							record.data.value = record.data.value + '|ASC';
							record.data.display = record.data.display + '|ASC';
							this.toMultiselect.view.store.add(record);
							selectionsArray.push((this.toMultiselect.view.store
									.getCount() - 1));

						}
					}
				}
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		if (this.allowDup)
			this.fromMultiselect.view.select(selectionsArray);
		else
			this.toMultiselect.view.select(selectionsArray);
	},

	toDesc : function() {
		if (this.disabled)
			return;
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			// data.records.push(this.store.getAt(i));
			if (!this.allowDup) {
				selectionsArray = [];
				for (var i = 0; i < records.length; i++) {
					record = records[i];
					var flag = 0;
					for (var i = 0; i < this.toMultiselect.view.store
							.getCount(); i++) {
						var record1 = this.toMultiselect.view.store.getAt(i);
						var tempValue = record1.data.value;
						// alert("record1.data.value--------------" +
						// record1.data.value);
						// if(record1.data.value.contains("|")){
						// alert("true");
						// }
						tempValue = tempValue.slice(0, record1.data.value
										.indexOf('|'));
						// alert("-------------for--------" +
						// record1.data.value);

						if (tempValue == record.data.value) {
							// alert("---------------if----------------");
							flag = 1;
						}
					}
					if (flag == 0) {

						if (this.allowDup) {
							var x = new Ext.data.Record();
							record.id = x.id;
							delete x;
							record.data.value = record.data.value + '|DESC';
							record.data.display = record.data.display + '|DESC';
							this.toMultiselect.view.store.add(record);
						} else {
							this.fromMultiselect.view.store.remove(record);
							record.data.value = record.data.value + '|DESC';
							record.data.display = record.data.display + '|DESC';
							this.toMultiselect.view.store.add(record);
							selectionsArray.push((this.toMultiselect.view.store
									.getCount() - 1));
						}
					}
				}
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		if (this.allowDup)
			this.fromMultiselect.view.select(selectionsArray);
		else
			this.toMultiselect.view.select(selectionsArray);
	},
	toBottom : function() {
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i = 0; i < records.length; i++) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				// wuxiaoxu 20110725 注释此判断修复user角色到列表最下方的bug
				//if (record.data.value != "user") {//
					this.toMultiselect.view.store.add(record);
				//}
				selectionsArray.push((this.toMultiselect.view.store.getCount())
						- (records.length - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},
	up : function() {
		if (this.disabled)
			return;
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		//yuzhijia 20111028 edit 修改算法，当选择多行时上下移动数据排列不正确,先移除，后加上
		
		//selectionsArray.sort();
		var newSelectionsArray = [];
		var tempRecordArray = [];
		if (selectionsArray.length > 0) {
			//到头就不再移动
			if(selectionsArray[0]=='0'){ 
				return;
			}
			/*for (var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]);
				if ((selectionsArray[i] - 1) >= 0) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(
							selectionsArray[i] - 1, record);
					newSelectionsArray.push(selectionsArray[i] - 1);
				}
			}*/
			for (var i = 0; i < selectionsArray.length; i++) {     
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]-i);   
				tempRecordArray.push(record);
				this.toMultiselect.view.store.remove(record);
			}
			for (var i = 0; i < tempRecordArray.length; i++) { 
				
				this.toMultiselect.view.store.insert(
							selectionsArray[i]-1 , tempRecordArray[i]);
				newSelectionsArray.push(selectionsArray[i] - 1);
			}
			this.toMultiselect.view.refresh();
			tempRecordArray=[];  
			this.toMultiselect.view.select(newSelectionsArray);
		}
	},

	down : function() {
		if (this.disabled)
			return;
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		//yuzhijia 20111028 edit 修改算法，当选择多行时上下移动数据排列不正确,先移除，后加上
		//selectionsArray.sort();
		//selectionsArray.reverse();
		var newSelectionsArray = [];
		var tempRecordArray = [];//yuzhijia 20111028
		if (selectionsArray.length > 0) {
			//到尾不再移动
			if(selectionsArray[selectionsArray.length-1]==this.toMultiselect.view.store
						.getCount()-1){
			   return;
			}
			/*for (var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]);
				if ((selectionsArray[i] + 1) < this.toMultiselect.view.store
						.getCount()) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(
							selectionsArray[i] + 1, record);
					newSelectionsArray.push(selectionsArray[i] + 1);
				}
			}*/
			for (var i = 0; i < selectionsArray.length; i++) { 
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]-i);   
				tempRecordArray.push(record);		
				//if ((selectionsArray[i] + 1) < this.toMultiselect.view.store
				//		.getCount()) { alert(1);
					this.toMultiselect.view.store.remove(record);
			//	}
			}
			for (var i = 0; i < tempRecordArray.length; i++) {
				//tempRecordArray.push(record);		
				//if ((selectionsArray[i] + 1) < this.toMultiselect.view.store
				//		.getCount()) {
				//	this.toMultiselect.view.store.remove(record);
				//}
				this.toMultiselect.view.store.insert(
							selectionsArray[i] + 1, tempRecordArray[i]);
				newSelectionsArray.push(selectionsArray[i]+ 1);
				//}
			}
			this.toMultiselect.view.refresh();

			this.toMultiselect.view.select(newSelectionsArray);
		}
	},
	// wuxiaoxu 20110714 将所有源中的值移动到目标框中
	fromToAll : function() {
		if (this.disabled)
			return;
		var nodes = this.fromMultiselect.view.getNodes()
		var records = this.fromMultiselect.view.getRecords(nodes);
		if (records.length == 0) {
			return;
		}
		for (var i = 0; i < records.length; i++) {
			record = records[i];
			if (this.allowDup) {
				var x = record.copy();
				var y = new Ext.data.Record();
				x.id = y.id;
				this.toMultiselect.view.store.add(x);
			} else {
				this.fromMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.add(record);
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
	},
	fromToAllForSort:function(v){//add jinwei 20111012 全部字段恢复初始值后，排序按照结构模板定义顺序
		var toData = eval(v) ;
		this.toMultiselect.store.loadData(toData);
		this.fromMultiselect.store.removeAll();
	},
	fromTo : function() {
		if (this.disabled)
			return;
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			if (!this.allowDup)
				selectionsArray = [];
			if (records.length > 0 && this.drawZero) {
				var patrn = /^[0-9]{1,20}$/;
				if (this.zeroField.getValue().trim() == '') {
					Ext.Msg
							.alert('\u6d88\u606f',
									'\u5b57\u6bb5\u957f\u5ea6\u4e0d\u80fd\u4e3a\u7a7a!');
					return;
				} else if (!patrn.exec(this.zeroField.getValue())
						|| this.zeroField.getValue() < 1) {
					Ext.Msg
							.alert('\u6d88\u606f',
									// '\u5b57\u6bb5\u957f\u5ea6\u8bbe\u7f6e\u4e0d\u5408\u6cd5!');
									// zhengfang 20100522 modify
									'\u5b57\u6bb5\u957f\u5ea6\u5fc5\u987b\u4e3a\u5927\u4e8e0\u7684\u6574\u6570!');

					return;
					// wuxiaoxu 20101216 增加对字段类型的判断，数值类型的字段不允许设置补零规则。start
					// --------------------------------------------
					// }else
					// if(this.zeroField.getValue()>this.filedLengthArray[record.data.value]){//zhangwenbin
					// 20100706 add
					// Ext.Msg.alert('\u6d88\u606f',
					// '\u8be5\u5b57\u6bb5\u957f\u5ea6\u6700\u5927\u4e3a'+this.filedLengthArray[record.data.value]+'\uff0c\u8bf7\u91cd\u65b0\u8bbe\u7f6e\u8be5\u5b57\u6bb5\u8865\u96f6\u957f\u5ea6\uff01');
					// wuxiaoxu 20110507 取值错误，造成判断不正确。如字段长度为20，补零长度3，就会提示超长。
				} else if (parseInt(this.zeroField.getValue(), 10) > this.filedLengthArray[record.data.value]
						.split("&")[0]) {// zhangwenbin 20100706 add
				// }else
				// if(this.zeroField.getValue()>this.filedLengthArray[record.data.value].split("&")[0]){//zhangwenbin
				// 20100706 add
					Ext.Msg
							.alert(
									'\u6d88\u606f',
									'\u8be5\u5b57\u6bb5\u957f\u5ea6\u6700\u5927\u4e3a'
											+ this.filedLengthArray[record.data.value]
													.split("&")[0]
											+ '\uff0c\u8bf7\u91cd\u65b0\u8bbe\u7f6e\u8be5\u5b57\u6bb5\u8865\u96f6\u957f\u5ea6\uff01');
					return;

				} else if ('NUMBER' == this.filedLengthArray[record.data.value]
						.split("&")[1]) {
					Ext.Msg
							.alert(
									'\u6d88\u606f',
									'\u6570\u503c\u7c7b\u578b\u7684\u5b57\u6bb5\u4e0d\u5141\u8bb8\u8bbe\u7f6e\u8865\u96f6\u89c4\u5219!');
					return;
				}
				// wuxiaoxu 20101216 end
				// --------------------------------------------------------------------------------------------
			}
			for (var i = 0; i < records.length; i++) {
				record = records[i];
				if (this.allowDup) {
					var x = record.copy();
					var y = new Ext.data.Record();
					x.id = y.id;
					// delete x;
					if (this.drawZero) {
						x.data.value = x.data.value + '|'
								+ this.zeroField.getValue();
						x.data.display = x.data.display + '|'
								+ this.zeroField.getValue();
					} else if (this.drawCombin) {
						x.data.value = x.data.value + '|true';
						x.data.display = x.data.display + '|true';
					} else if (this.drawScan) {
						x.data.value = x.data.value + '|FIELD';
						x.data.display = x.data.display + '|FIELD';
					}
					this.toMultiselect.view.store.add(x);
				} else {
					this.fromMultiselect.view.store.remove(record);
					if (this.drawZero) {
						record.data.value = record.data.value + '|'
								+ this.zeroField.getValue();
						record.data.display = record.data.display + '|'
								+ this.zeroField.getValue();
					} else if (this.drawCombin) {
						record.data.value = record.data.value + '|true';
						record.data.display = record.data.display + '|true';
					} else if (this.drawScan) {
						record.data.value = record.data.value + '|FIELD';
						record.data.display = record.data.display + '|FIELD';
					}
					this.toMultiselect.view.store.add(record);
					selectionsArray.push((this.toMultiselect.view.store
							.getCount() - 1));

				}
				// if (this.functionName != '' && this.functionName !=
				// undefined) {// /////////
				// this.functionName('fromTo', record);
				// }
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
		if (this.toSortField)
			this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
		if (this.allowDup)
			this.fromMultiselect.view.select(selectionsArray);
		else
			this.toMultiselect.view.select(selectionsArray);
	},

	toFrom : function() {
		if (this.disabled)
			return;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {
			return;
		}
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i = 0; i < selectionsArray.length; i++) {
				record = this.toMultiselect.view.store
						.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i = 0; i < records.length; i++) {
				record = records[i];
				// xiaoxiong 20100812 add 监听用户编辑处去除用户角色时不能删除“普通用户”角色
				if (this.validateToFrom && record.data.value == 'user') {
					Ext.Msg.alert('消息', 'User角色是用户必备角色，不能去除!');
					return;
				}
				// end
				this.toMultiselect.view.store.remove(record);
				if (!this.allowDup) {
					// wuxiaoxu
					var tempValue = record.data.value;
					if (this.drawAsc || this.drawDesc || this.drawZero
							|| this.drawCombin || this.drawScan) {
						record.data.value = record.data.value.slice(0,
								record.data.value.indexOf('|'));
						record.data.display = record.data.display.slice(0,
								record.data.display.indexOf('|'));
					}
					if (tempValue.indexOf('false') < 0
							&& tempValue.indexOf('CONNECTOR') < 0
							&& tempValue.indexOf('PATH') < 0) {

						var flag = false;
						for (var i = 0; i < this.fromMultiselect.view.store
								.getCount(); i++) {
							if (this.fromMultiselect.view.store.getAt(i).data.value == record.data.value) {
								flag = true;
								break;

							}
						}
						if (!flag) {
							this.fromMultiselect.view.store.add(record);
						}
					}
					selectionsArray.push((this.fromMultiselect.view.store
							.getCount() - 1));
				}
				// if (this.functionName != '' && this.functionName !=
				// undefined) {// /////////
				// this.functionName('toFrom', record);
				// }
			}
		}
		this.toMultiselect.view.refresh();
		if (tempValue.indexOf('false') < 0
				&& tempValue.indexOf('CONNECTOR') < 0
				&& tempValue.indexOf('PATH') < 0) {
			this.fromMultiselect.view.refresh();
			if (this.fromSortField)
				this.fromMultiselect.store.sort(this.fromSortField,
						this.fromSortDir);
			this.fromMultiselect.view.select(selectionsArray);
		}
		if (this.functionName != '' && this.functionName != null) {
			this.functionName('dbtoFrom', null);
		}

	},

	valueChanged : function(store) {
		var record = null;
		var values = [];
		for (var i = 0; i < store.getCount(); i++) {
			record = store.getAt(i);
			values.push(record.get(this.valueField));
		}
		this.hiddenField.dom.value = values.join(this.delimiter);
		this.fireEvent('change', this, this.getValue(),
				this.hiddenField.dom.value);
	},

	getValue : function() {
		return this.hiddenField.dom.value;
	},

	onRowDblClick : function(vw, index, node, e) {
		return this.fireEvent('rowdblclick', vw, index, node, e);
	},

	reset : function() {
		range = this.toMultiselect.store.getRange();
		this.toMultiselect.store.removeAll();
		if (!this.allowDup) {
			this.fromMultiselect.store.add(range);
			this.fromMultiselect.store.sort(this.displayField, 'ASC');
		}
		this.valueChanged(this.toMultiselect.store);
	},

	onDestroy : function() {
		if (this.fromMultiselect) {
			this.fromMultiselect.destroy();
		}
		if (this.toMultiselect) {
			this.toMultiselect.destroy();
		}
		//			    
		Ext.ux.ItemSelector.superclass.onDestroy.call(this);
		// Ext.destroy(this);
	},

	onEnable : function() {
		this.fromMultiselect.enable();
		this.toMultiselect.enable();
	},

	onDisable : function() {
		this.fromMultiselect.disable();
		this.toMultiselect.disable();
	}

});

Ext.reg("itemselector", Ext.ux.ItemSelector);

/** *************************************** */
Array.prototype.contains = function(element) {
	return this.indexOf(element) !== -1;
};

Ext.namespace("Ext.ux");

/**
 * @class Ext.ux.DDView A DnD enabled version of Ext.View.
 * @param {Element/String}
 *            container The Element in which to create the View.
 * @param {String}
 *            tpl The template string used to create the markup for each element
 *            of the View
 * @param {Object}
 *            config The configuration properties. These include all the config
 *            options of {@link Ext.View} plus some specific to this class.<br>
 *            <p>
 *            Drag/drop is implemented by adding {@link Ext.data.Record}s to
 *            the target DDView. If copying is not being performed, the original
 *            {@link Ext.data.Record} is removed from the source DDView.<br>
 *            <p>
 *            The following extra CSS rules are needed to provide insertion
 *            point highlighting:
 * 
 * <pre><code>
 *  
 *  .x-view-drag-insert-above { 
 *  border-top:1px dotted #3366cc; 
 *  } 
 *  .x-view-drag-insert-below { 
 *  border-bottom:1px dotted #3366cc; 
 *  } 
 * </code></pre>
 * 
 */
Ext.ux.DDView = function(config) {
	if (!config.itemSelector) {
		var tpl = config.tpl;
		if (this.classRe.test(tpl)) {
			config.tpl = tpl.replace(this.classRe,
					'class=$1x-combo-list-item $2$1');
		} else {
			config.tpl = tpl.replace(this.tagRe,
					'$1 class="x-combo-list-item" $2');
		}
		config.itemSelector = ".x-combo-list-item";
	}
	Ext.ux.DDView.superclass.constructor.call(this, Ext.apply(config, {
						border : false
					}));
};

Ext.extend(Ext.ux.DDView, Ext.DataView, {
	/**
	 * @cfg {String/Array} dragGroup The ddgroup name(s) for the View's
	 *      DragZone.
	 */
	/**
	 * @cfg {String/Array} dropGroup The ddgroup name(s) for the View's
	 *      DropZone.
	 */
	/**
	 * @cfg {Boolean} copy Causes drag operations to copy nodes rather than
	 *      move.
	 */
	/**
	 * @cfg {Boolean} allowCopy Causes ctrl/drag operations to copy nodes rather
	 *      than move.
	 */
	dragDisabled : false,

	sortDir : 'ASC',

	isFormField : true,

	classRe : /class=(['"])(.*)\1/,

	tagRe : /(<\w*)(.*?>)/,

	reset : Ext.emptyFn,

	clearInvalid : Ext.form.Field.prototype.clearInvalid,

	msgTarget : 'qtip',

	dbclick : true,// wuxiaoxu

	type : '',

	functionName : '',

	afterRender : function() {
		Ext.ux.DDView.superclass.afterRender.call(this);
		if (this.dragGroup) {
			this.setDraggable(this.dragGroup.split(","));
		}
		if (this.dropGroup) {
			this.setDroppable(this.dropGroup.split(","));
		}
		if (this.deletable) {
			this.setDeletable();
		}
		this.isDirtyFlag = false;
		this.addEvents("drop");
	},

	validate : function() {
		return true;
	},

	onDestroy : function() {
		this.purgeListeners();
		this.getEl().removeAllListeners();
		this.getEl().remove();
		if (this.dragZone) {
			Ext.dd.ScrollManager.unregister(this.dragZone.el);
			if (this.dragZone.destroy) {
				this.dragZone.destroy();
				this.dragZone.proxy.el.destroy();
			}
		}
		if (this.dropZone) {
			Ext.dd.ScrollManager.unregister(this.dropZone.el);
			if (this.dropZone.destroy) {
				this.dropZone.destroy();
			}
		}
		Ext.ux.DDView.superclass.onDestroy.call(this);
	},

	/**
	 * Allows this class to be an Ext.form.Field so it can be found using
	 * {@link Ext.form.BasicForm#findField}.
	 */
	getName : function() {
		return this.name;
	},

	/**
	 * Loads the View from a JSON string representing the Records to put into
	 * the Store.
	 */
	setValue : function(v) {
		if (!this.store) {
			throw "DDView.setValue(). DDView must be constructed with a valid Store";
		}
		var data = {};
		data[this.store.reader.meta.root] = v ? [].concat(v) : [];
		this.store.proxy = new Ext.data.MemoryProxy(data);
		this.store.load();
	},

	/**
	 * @return {String} a parenthesised list of the ids of the Records in the
	 *         View.
	 */
	getValue : function() {
		var result = '(';
		this.store.each(function(rec) {
					result += rec.id + ',';
				});
		return result.substr(0, result.length - 1) + ')';
	},

	getIds : function() {
		var i = 0, result = new Array(this.store.getCount());
		this.store.each(function(rec) {
					result[i++] = rec.id;
				});
		return result;
	},

	isDirty : function() {
		return this.isDirtyFlag;
	},

	/**
	 * Part of the Ext.dd.DropZone interface. If no target node is found, the
	 * whole Element becomes the target, and this causes the drop gesture to
	 * append.
	 */
	getTargetFromEvent : function(e) {
		var target = e.getTarget();
		while ((target !== null) && (target.parentNode != this.el.dom)) {
			target = target.parentNode;
		}
		if (!target) {
			target = this.el.dom.lastChild || this.el.dom;
		}
		return target;
	},

	/**
	 * Create the drag data which consists of an object which has the property
	 * "ddel" as the drag proxy element.
	 */
	getDragData : function(e) {
		var target = this.findItemFromChild(e.getTarget());
		if (target) {
			if (!this.isSelected(target)) {
				delete this.ignoreNextClick;
				this.onItemClick(target, this.indexOf(target), e);
				this.ignoreNextClick = true;
				// xiaoxiong 20100527 add 为了解决ctrlKey事件的bug
			} else if (this.multiSelect || this.singleSelect) {
				if (this.isSelected(target) && e.ctrlKey) {
					this.deselect(target);
				}
				e.preventDefault();
			}
			// end
			var dragData = {
				sourceView : this,
				viewNodes : [],
				records : [],
				copy : this.copy || (this.allowCopy && e.ctrlKey)
			};
			if (this.getSelectionCount() == 1) {
				var i = this.getSelectedIndexes()[0];
				var n = this.getNode(i);
				dragData.viewNodes.push(dragData.ddel = n);
				dragData.records.push(this.store.getAt(i));
				dragData.repairXY = Ext.fly(n).getXY();
			} else {
				dragData.ddel = document.createElement('div');
				dragData.ddel.className = 'multi-proxy';
				this.collectSelection(dragData);
			}
			return dragData;
		}
		return false;
	},

	// override the default repairXY.
	getRepairXY : function(e) {
		return this.dragData.repairXY;
	},

	/** Put the selections into the records and viewNodes Arrays. */
	collectSelection : function(data) {
		data.repairXY = Ext.fly(this.getSelectedNodes()[0]).getXY();
		if (this.preserveSelectionOrder === true) {
			Ext.each(this.getSelectedIndexes(), function(i) {
						var n = this.getNode(i);
						var dragNode = n.cloneNode(true);
						dragNode.id = Ext.id();
						data.ddel.appendChild(dragNode);
						data.records.push(this.store.getAt(i));
						data.viewNodes.push(n);
					}, this);
		} else {
			var i = 0;
			this.store.each(function(rec) {
						if (this.isSelected(i)) {
							var n = this.getNode(i);
							var dragNode = n.cloneNode(true);
							dragNode.id = Ext.id();
							data.ddel.appendChild(dragNode);
							data.records.push(this.store.getAt(i));
							data.viewNodes.push(n);
						}
						i++;
					}, this);
		}
	},

	/** Specify to which ddGroup items in this DDView may be dragged. */
	setDraggable : function(ddGroup) {
		if (ddGroup instanceof Array) {
			Ext.each(ddGroup, this.setDraggable, this);
			return;
		}
		if (this.dragZone) {
			this.dragZone.addToGroup(ddGroup);
		} else {
			this.dragZone = new Ext.dd.DragZone(this.getEl(), {
						containerScroll : true,
						ddGroup : ddGroup
					});
			// Draggability implies selection. DragZone's mousedown selects the
			// element.
			if (!this.multiSelect) {
				this.singleSelect = true;
			}

			// Wire the DragZone's handlers up to methods in *this*
			this.dragZone.getDragData = this.getDragData.createDelegate(this);
			this.dragZone.getRepairXY = this.getRepairXY;
			this.dragZone.onEndDrag = this.onEndDrag;
		}
	},

	/** Specify from which ddGroup this DDView accepts drops. */
	setDroppable : function(ddGroup) {
		if (ddGroup instanceof Array) {
			Ext.each(ddGroup, this.setDroppable, this);
			return;
		}
		if (this.dropZone) {
			this.dropZone.addToGroup(ddGroup);
		} else {
			this.dropZone = new Ext.dd.DropZone(this.getEl(), {
						owningView : this,
						containerScroll : true,
						ddGroup : ddGroup
					});

			// Wire the DropZone's handlers up to methods in *this*
			this.dropZone.getTargetFromEvent = this.getTargetFromEvent
					.createDelegate(this);
			this.dropZone.onNodeEnter = this.onNodeEnter.createDelegate(this);
			this.dropZone.onNodeOver = this.onNodeOver.createDelegate(this);
			this.dropZone.onNodeOut = this.onNodeOut.createDelegate(this);
			this.dropZone.onNodeDrop = this.onNodeDrop.createDelegate(this);
		}
	},

	/** Decide whether to drop above or below a View node. */
	getDropPoint : function(e, n, dd) {
		if (n == this.el.dom) {
			return "above";
		}
		var t = Ext.lib.Dom.getY(n), b = t + n.offsetHeight;
		var c = t + (b - t) / 2;
		var y = Ext.lib.Event.getPageY(e);
		if (y <= c) {
			return "above";
		} else {
			return "below";
		}
	},

	isValidDropPoint : function(pt, n, data) {
		if (this.dragDisabled)
			return false;
		if (!data.viewNodes || (data.viewNodes.length != 1)) {
			return true;
		}
		var d = data.viewNodes[0];
		if (d == n) {
			return false;
		}
		if ((pt == "below") && (n.nextSibling == d)) {
			return false;
		}
		if ((pt == "above") && (n.previousSibling == d)) {
			return false;
		}
		return true;
	},

	onNodeEnter : function(n, dd, e, data) {
		if (this.highlightColor && (data.sourceView != this)) {
			this.el.highlight(this.highlightColor);
		}
		return false;
	},

	onNodeOver : function(n, dd, e, data) {
		var dragElClass = this.dropNotAllowed;
		var pt = this.getDropPoint(e, n, dd);
		if (this.isValidDropPoint(pt, n, data)) {
			if (this.appendOnly || this.sortField) {
				return "x-tree-drop-ok-below";
			}

			// set the insert point style on the target node
			if (pt) {
				var targetElClass;
				if (pt == "above") {
					dragElClass = n.previousSibling
							? "x-tree-drop-ok-between"
							: "x-tree-drop-ok-above";
					targetElClass = "x-view-drag-insert-above";
				} else {
					dragElClass = n.nextSibling
							? "x-tree-drop-ok-between"
							: "x-tree-drop-ok-below";
					targetElClass = "x-view-drag-insert-below";
				}
				if (this.lastInsertClass != targetElClass) {
					Ext.fly(n)
							.replaceClass(this.lastInsertClass, targetElClass);
					this.lastInsertClass = targetElClass;
				}
			}
		}
		return dragElClass;
	},

	onNodeOut : function(n, dd, e, data) {
		this.removeDropIndicators(n);
	},

	onNodeDrop : function(n, dd, e, data) {
		if (this.dragDisabled)
			return false;
		if (this.fireEvent("drop", this, n, dd, e, data) === false) {
			return false;
		}
		var pt = this.getDropPoint(e, n, dd);
		var insertAt = (this.appendOnly || (n == this.el.dom)) ? this.store
				.getCount() : n.viewIndex;
		if (pt == "below") {
			insertAt++;
		}

		// Validate if dragging within a DDView
		if (data.sourceView == this) {
			// If the first element to be inserted below is the target node,
			// remove it
			if (pt == "below") {
				if (data.viewNodes[0] == n) {
					data.viewNodes.shift();
				}
			} else { // If the last element to be inserted above is the
				// target node, remove it
				if (data.viewNodes[data.viewNodes.length - 1] == n) {
					data.viewNodes.pop();
				}
			}

			// Nothing to drop...
			if (!data.viewNodes.length) {
				return false;
			}

			// If we are moving DOWN, then because a store.remove() takes place
			// first,
			// the insertAt must be decremented.
			if (insertAt > this.store.indexOf(data.records[0])) {
				insertAt--;
			}
		}

		// Dragging from a Tree. Use the Tree's recordFromNode function.
		if (data.node instanceof Ext.tree.TreeNode) {
			var r = data.node.getOwnerTree().recordFromNode(data.node);
			if (r) {
				data.records = [r];
			}
		}

		if (!data.records) {
			alert("Programming problem. Drag data contained no Records");
			return false;
		}
		var userNumber = 0;// 20100812 add 监听用户编辑处去除用户角色时不能删除“普通用户”角色
		for (var i = 0; i < data.records.length; i++) {
			// /////////
			var r = data.records[i];

			// xiaoxiong 20100812 add 监听用户编辑处去除用户角色时不能删除“普通用户”角色
			if (this.type == 'validateToFrom' && r.data.value == 'user') {
				userNumber = 1;
				continue;
			}
			// end

			var dup = this.store.getById(r.id);
			if (dup && (dd != this.dragZone)) {
				if (!this.allowDup && !this.allowTrash) {
					Ext.fly(this.getNode(this.store.indexOf(dup))).frame("red",
							1);
					return true
				}
				var x = new Ext.data.Record();
				r.id = x.id;
				delete x;
			}
			if (data.copy) {
				// if (this.type == 'fromTo' || this.type == 'toFrom') {
				// this.functionName(this.type, r);
				// } else

				var tempValue = r.data.value;
				if (this.type == 'from' || this.type == 'combinToFrom'
						|| this.type == 'scanToFrom') {
					if(this.type == 'combinToFrom'){//ninglong20110830 组合字段替换
						if (this.functionName != '') {
							this.functionName('db' + this.type, r);
						}
					}
					r.data.value = r.data.value.slice(0, r.data.value
									.indexOf('|'));
					r.data.display = r.data.display.slice(0, r.data.display
									.indexOf('|'));
				} else if (this.type == 'combinFromTo') {
					r.data.display = r.data.display + '|true';
					r.data.value = r.data.value + '|true';
				} else if (this.type == 'scanFromTo') {
					r.data.display = r.data.display + '|FIELD';
					r.data.value = r.data.value + '|FIELD';
				} else if (this.type == 'toFrom') {
					if (this.functionName != '') {
						this.functionName('db' + this.type, r);
					}
				} else if (this.type == 'fromsort') {
					alert("-----------------------------------1-------------------------------");
				}
				if (tempValue.indexOf('false') < 0
						&& tempValue.indexOf('PATH') < 0
						&& tempValue.indexOf('CONNECTOR') < 0) {
					this.store.insert(insertAt++, r.copy());
				}

			} else {
				if (data.sourceView) {
					data.sourceView.isDirtyFlag = true;
					data.sourceView.store.remove(r);
				}
				if (!this.allowTrash) {
					// if (this.type == 'fromTo' || this.type == 'toFrom') {
					// this.functionName(this.type, r);
					// } else
					var tempValue = r.data.value;
					if (this.type == 'from' || this.type == 'combinToFrom'
							|| this.type == 'scanToFrom') {
						if(this.type == 'combinToFrom'){//ninglong20110830 组合字段替换
							if (this.functionName != '') {
								this.functionName('db' + this.type, r);
							}
						}
						r.data.value = r.data.value.slice(0, r.data.value
										.indexOf('|'));
						r.data.display = r.data.display.slice(0, r.data.display
										.indexOf('|'));
					} else if (this.type == 'combinFromTo') {
						r.data.display = r.data.display + '|true';
						r.data.value = r.data.value + '|true';
					} else if (this.type == 'scanFromTo') {
						r.data.display = r.data.display + '|FIELD';
						r.data.value = r.data.value + '|FIELD';
					} else if (this.type == 'toFrom') {
						if (this.functionName != '') {
							this.functionName('db' + this.type, r);
						}
					} else if (this.type == 'fromsort') {
						r.data.value = r.data.value.slice(0, r.data.value
										.indexOf('|'));
						r.data.display = r.data.display.slice(0, r.data.display
										.indexOf('|'));
						var d = tempValue.slice(tempValue.indexOf('|') + 1,
								tempValue.length);
						// var s=d.toLowerCase();
						// tempValue.indexOf('|')+1) tempValue.length);
						if (d != "ASC" && d != "DESC") {
							return;
						}

					}
					if (tempValue.indexOf('false') < 0
							&& tempValue.indexOf('PATH') < 0
							&& tempValue.indexOf('CONNECTOR') < 0) {

						this.store.insert(insertAt++, r);
					}
				}
			}
			if (this.sortField) {
				this.store.sort(this.sortField, this.sortDir);
			}
			this.isDirtyFlag = true;
		}
		// xiaoxiong 20100812 add 监听用户编辑处去除用户角色时不能删除“普通用户”角色
		if (this.type == 'validateToFrom' && userNumber == 1) {
			Ext.Msg.alert('消息', 'User角色是用户必备角色，不能去除!');
			return;
		}
		// end
		this.dragZone.cachedTarget = null;
		return true;
	},

	// Ensure the multi proxy is removed
	onEndDrag : function(data, e) {
		var d = Ext.get(this.dragData.ddel);
		if (d && d.hasClass("multi-proxy")) {
			d.remove();
			// delete this.dragData.ddel;
		}
	},

	removeDropIndicators : function(n) {
		if (n) {
			Ext.fly(n).removeClass(["x-view-drag-insert-above",
					"x-view-drag-insert-left", "x-view-drag-insert-right",
					"x-view-drag-insert-below"]);
			this.lastInsertClass = "_noclass";
		}
	},

	/**
	 * Utility method. Add a delete option to the DDView's context menu.
	 * 
	 * @param {String}
	 *            imageUrl The URL of the "delete" icon image.
	 */
	setDeletable : function(imageUrl) {
		if (!this.singleSelect && !this.multiSelect) {
			this.singleSelect = true;
		}
		var c = this.getContextMenu();
		this.contextMenu.on("itemclick", function(item) {
					switch (item.id) {
						case "delete" :
							this.remove(this.getSelectedIndexes());
							break;
					}
				}, this);
		this.contextMenu.add({
					icon : imageUrl || AU.resolveUrl("/images/delete.gif"),
					id : "delete",
					text : AU.getMessage("deleteItem")
				});
	},

	/** Return the context menu for this DDView. */
	getContextMenu : function() {
		if (!this.contextMenu) {
			// Create the View's context menu
			this.contextMenu = new Ext.menu.Menu({
						id : this.id + "-contextmenu"
					});
			this.el.on("contextmenu", this.showContextMenu, this);
		}
		return this.contextMenu;
	},

	disableContextMenu : function() {
		if (this.contextMenu) {
			this.el.un("contextmenu", this.showContextMenu, this);
		}
	},

	showContextMenu : function(e, item) {
		item = this.findItemFromChild(e.getTarget());
		if (item) {
			e.stopEvent();
			this
					.select(this.getNode(item), this.multiSelect && e.ctrlKey,
							true);
			this.contextMenu.showAt(e.getXY());
		}
	},

	/**
	 * Remove {@link Ext.data.Record}s at the specified indices.
	 * 
	 * @param {Array/Number}
	 *            selectedIndices The index (or Array of indices) of Records to
	 *            remove.
	 */
	remove : function(selectedIndices) {
		selectedIndices = [].concat(selectedIndices);
		for (var i = 0; i < selectedIndices.length; i++) {
			var rec = this.store.getAt(selectedIndices[i]);
			this.store.remove(rec);
		}
	},

	/**
	 * Double click fires the event, but also, if this is draggable, and there
	 * is only one other related DropZone that is in another DDView, it drops
	 * the selected node on that DDView.
	 */
	onDblClick : function(e) {
		this.focus();
		if (!this.dbclick) {
			return;
		}
		var item = this.findItemFromChild(e.getTarget());
		if (item) {
			if (this.fireEvent("dblclick", this, this.indexOf(item), item, e) === false) {
				return false;
			}
			if (this.dragGroup) {
				var targets = Ext.dd.DragDropMgr
						.getRelated(this.dragZone, true);

				// Remove instances of this View's DropZone
				while (targets.contains(this.dropZone)) {
					targets.remove(this.dropZone);
				}

				// If there's only one other DropZone, and it is owned by a
				// DDView, then drop it in
				if ((targets.length == 1) && (targets[0].owningView)) {
					this.dragZone.cachedTarget = null;
					var el = Ext.get(targets[0].getEl());
					var box = el.getBox(true);
					targets[0].onNodeDrop(el.dom, {
								target : el.dom,
								xy : [box.x, box.y + box.height - 1]
							}, null, this.getDragData(e));
				}
			}
		}
	},

	onItemClick : function(item, index, e) {
		// The DragZone's mousedown->getDragData already handled selection
		this.focus();
		if (this.ignoreNextClick) {
			delete this.ignoreNextClick;
			return;
		}

		if (this.fireEvent("beforeclick", this, index, item, e) === false) {
			return false;
		}
		if (this.multiSelect || this.singleSelect) {

			if (this.multiSelect && e.shiftKey && this.lastSelection) {
				this.select(this.getNodes(this.indexOf(this.lastSelection),
								index), false);
			} else if (this.isSelected(item) && e.ctrlKey) {
				this.deselect(item);
			} else {
				this.deselect(item);
				this.select(item, this.multiSelect && e.ctrlKey);
				this.lastSelection = item;
			}
			e.preventDefault();
		}
		return true;
	},

	onClick : function(e) {
		// wangjie

		var selectionsArray = this.getSelectedIndexes();

		record = this.store.getAt(selectionsArray[0]);
		// alert("record.data.value-------------" + record.data.value);
		if (this.type == 'fromTo'||this.type == 'combinFromTo') {//ninglong20110829 组合字段替换
			this.functionName(this.type, record);
		}

	}

});

Ext.grid.CheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
		}
	},

	renderer : function(v, p, record) {
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (v ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};

// jiang add 20090419
function openWindow(url, winTitle, winParams) {
	winName = window.open(url, winTitle, winParams);
	winName.focus();
}
// jiang add 20090419
function openPopWin(url, winTitle, size) {
	if (url == '') {
		return false;
	}
	var screenWidth = 0;
	var screenHeight = 0;
	// size=100;
	if (size == 100) {
		screenWidth = window.screen.availWidth;
		screenHeight = window.screen.availHeight;
	} else if (size == 1) {
		screenWidth = 280;
		screenHeight = 120;
	} else if (size == 2) {
		screenWidth = 600;
		screenHeight = 400;
	} else {
		screenWidth = 800;
		screenHeight = 540;
	}

	var screenLeft = (window.screen.availWidth - screenWidth) / 2;
	var screenTop = (window.screen.availHeight - screenHeight) / 2;
	if (size = 100) {
		screenWidth = screenWidth - 10;
		screenHeight = screenHeight - 60
	}
	var winParams = "width=" + screenWidth + ",height=" + screenHeight;
	winParams += ",left=" + screenLeft + ",top=" + screenTop
			+ ",toolbar=no,scrollbars=yes,resizable=no,status=yes";

	openWindow(url, winTitle, winParams);
}

/**
 * 
 * Portal start
 */
Ext.ux.Portal = Ext.extend(Ext.Panel, {
			layout : 'column',
			autoScroll : true,
			cls : 'x-portal',
			defaultType : 'portalcolumn',

			initComponent : function() {
				Ext.ux.Portal.superclass.initComponent.call(this);
				this.addEvents({
							validatedrop : true,
							beforedragover : true,
							dragover : true,
							beforedrop : true,
							drop : true
						});
			},

			initEvents : function() {
				Ext.ux.Portal.superclass.initEvents.call(this);
				this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
			},

			beforeDestroy : function() {
				if (this.dd) {
					this.dd.unreg();
				}
				Ext.ux.Portal.superclass.beforeDestroy.call(this);
			}
		});
Ext.reg('portal', Ext.ux.Portal);

Ext.ux.Portal.DropZone = function(portal, cfg) {
	this.portal = portal;
	Ext.dd.ScrollManager.register(portal.body);
	Ext.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom,
			cfg);
	portal.body.ddScrollConfig = this.ddScrollConfig;
};

Ext.extend(Ext.ux.Portal.DropZone, Ext.dd.DropTarget, {
	ddScrollConfig : {
		vthresh : 50,
		hthresh : -1,
		animate : true,
		increment : 200
	},

	createEvent : function(dd, e, data, col, c, pos) {
		return {
			portal : this.portal,
			panel : data.panel,
			columnIndex : col,
			column : c,
			position : pos,
			data : data,
			source : dd,
			rawEvent : e,
			status : this.dropAllowed
		};
	},

	notifyOver : function(dd, e, data) {
		var xy = e.getXY(), portal = this.portal, px = dd.proxy;

		// case column widths
		if (!this.grid) {
			this.grid = this.getGrid();
		}

		// handle case scroll where scrollbars appear during drag
		var cw = portal.body.dom.clientWidth;
		if (!this.lastCW) {
			this.lastCW = cw;
		} else if (this.lastCW != cw) {
			this.lastCW = cw;
			portal.doLayout();
			this.grid = this.getGrid();
		}

		// determine column
		var col = 0, xs = this.grid.columnX, cmatch = false;
		for (var len = xs.length; col < len; col++) {
			if (xy[0] < (xs[col].x + xs[col].w)) {
				cmatch = true;
				break;
			}
		}
		// no match, fix last index
		if (!cmatch) {
			col--;
		}

		// find insert position
		var p, match = false, pos = 0, c = portal.items.itemAt(col), items = c.items.items, overSelf = false;

		for (var len = items.length; pos < len; pos++) {
			p = items[pos];
			var h = p.el.getHeight();
			if (h === 0) {
				overSelf = true;
			} else if ((p.el.getY() + (h / 2)) > xy[1]) {
				match = true;
				break;
			}
		}

		pos = (match && p ? pos : c.items.getCount()) + (overSelf ? -1 : 0);
		var overEvent = this.createEvent(dd, e, data, col, c, pos);

		if (portal.fireEvent('validatedrop', overEvent) !== false
				&& portal.fireEvent('beforedragover', overEvent) !== false) {

			// make sure proxy width is fluid
			px.getProxy().setWidth('auto');

			if (p) {
				px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
			} else {
				px.moveProxy(c.el.dom, null);
			}

			this.lastPos = {
				c : c,
				col : col,
				p : overSelf || (match && p) ? pos : false
			};
			this.scrollPos = portal.body.getScroll();

			portal.fireEvent('dragover', overEvent);

			return overEvent.status;
		} else {
			return overEvent.status;
		}

	},

	notifyOut : function() {
		delete this.grid;
	},

	notifyDrop : function(dd, e, data) {
		delete this.grid;
		if (!this.lastPos) {
			return;
		}
		var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

		var dropEvent = this.createEvent(dd, e, data, col, c, pos !== false
						? pos
						: c.items.getCount());

		if (this.portal.fireEvent('validatedrop', dropEvent) !== false
				&& this.portal.fireEvent('beforedrop', dropEvent) !== false) {

			dd.proxy.getProxy().remove();
			dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);

			if (pos !== false) {
				if (c == dd.panel.ownerCt
						&& (c.items.items.indexOf(dd.panel) <= pos)) {
					pos++;
				}
				c.insert(pos, dd.panel);
			} else {
				c.add(dd.panel);
			}

			c.doLayout();

			this.portal.fireEvent('drop', dropEvent);

			// scroll position is lost on drop, fix it
			var st = this.scrollPos.top;
			if (st) {
				var d = this.portal.body.dom;
				setTimeout(function() {
							d.scrollTop = st;
						}, 10);
			}

		}
		delete this.lastPos;
	},

	// internal cache of body and column coords
	getGrid : function() {
		var box = this.portal.bwrap.getBox();
		box.columnX = [];
		this.portal.items.each(function(c) {
					box.columnX.push({
								x : c.el.getX(),
								w : c.el.getWidth()
							});
				});
		return box;
	},

	// unregister the dropzone from ScrollManager
	unreg : function() {
		// Ext.dd.ScrollManager.unregister(this.portal.body);
		Ext.ux.Portal.DropZone.superclass.unreg.call(this);
	}
});
Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
			layout : 'anchor',
			autoEl : 'div',
			defaultType : 'portlet',
			cls : 'x-portal-column'
		});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);

Ext.ux.Portlet = Ext.extend(Ext.Panel, {
			anchor : '100%',
			frame : true,
			collapsible : true,
			draggable : true,
			cls : 'x-portlet'
		});
Ext.reg('portlet', Ext.ux.Portlet);

Ext.namespace("Ext.ux.plugins");

Ext.ux.plugins.GroupHeaderGrid = function(config) {
	Ext.apply(this, config);
};

Ext.extend(Ext.ux.plugins.GroupHeaderGrid, Ext.util.Observable, {
	init : function(grid) {
		var v = grid.getView();
		v.beforeMethod('initTemplates', this.initTemplates);
		v.renderHeaders = this.renderHeaders.createDelegate(v,
				[v.renderHeaders]);
		v.afterMethod('onColumnWidthUpdated', this.updateGroupStyles);
		v.afterMethod('onAllColumnWidthsUpdated', this.updateGroupStyles);
		v.afterMethod('onColumnHiddenUpdated', this.updateGroupStyles);
		v.getHeaderCell = this.getHeaderCell;
		v.updateSortIcon = this.updateSortIcon;
		v.getGroupStyle = this.getGroupStyle;
	},

	initTemplates : function() {
		var ts = this.templates || {};
		if (!ts.gcell) {
			ts.gcell = new Ext.Template(
					'<td class="x-grid3-hd {cls} x-grid3-td-{id}" style="{style}">',
					'<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">{value}</div>',
					'</td>');
		}
		this.templates = ts;
	},

	renderHeaders : function(renderHeaders) {
		var ts = this.templates, rows = [], tw = this.getTotalWidth();
		for (var i = 0; i < this.cm.rows.length; i++) {
			var r = this.cm.rows[i], cells = [], col = 0;
			for (var j = 0; j < r.length; j++) {
				var c = r[j];
				c.colspan = c.colspan || 1;
				c.col = col;
				col += c.colspan;
				var gs = this.getGroupStyle(c);
				cells[j] = ts.gcell.apply({
							id : c.id || i + '-' + col,
							cls : c.header
									? 'ux-grid-hd-group-cell'
									: 'ux-grid-hd-nogroup-cell',
							style : 'width:'
									+ gs.width
									+ ';'
									+ (gs.hidden ? 'display:none;' : '')
									+ (c.align
											? 'text-align:' + c.align + ';'
											: ''),
							tooltip : c.tooltip ? (Ext.QuickTips.isEnabled()
									? 'ext:qtip'
									: 'title')
									+ '="' + c.tooltip + '"' : '',
							value : c.header || '&#160;',
							istyle : c.align == 'right'
									? 'padding-right:16px'
									: ''
						});
			}
			rows[i] = ts.header.apply({
						tstyle : 'width:' + tw + ';',
						cells : cells.join('')
					});
		}
		rows[rows.length] = renderHeaders.call(this);
		return rows.join('');
	},

	getGroupStyle : function(c) {
		var w = 0, h = true;
		for (var i = c.col; i < c.col + c.colspan; i++) {
			if (!this.cm.isHidden(i)) {
				var cw = this.cm.getColumnWidth(i);
				if (typeof cw == 'number') {
					w += cw;
				}
				h = false;
			}
		}
		return {
			width : (Ext.isBorderBox ? w : Math.max(w - this.borderWidth, 0))
					+ 'px',
			hidden : h
		}
	},

	updateGroupStyles : function(col) {
		var tables = this.mainHd.query('.x-grid3-header-offset > table'), tw = this
				.getTotalWidth();
		for (var i = 0; i < tables.length; i++) {
			tables[i].style.width = tw;
			if (i < this.cm.rows.length) {
				var cells = tables[i].firstChild.firstChild.childNodes;
				for (var j = 0; j < cells.length; j++) {
					var c = this.cm.rows[i][j];
					if ((typeof col != 'number')
							|| (col >= c.col && col < c.col + c.colspan)) {
						var gs = this.getGroupStyle(c);
						cells[j].style.width = gs.width;
						cells[j].style.display = gs.hidden ? 'none' : '';
					}
				}
			}
		}
	},

	getHeaderCell : function(index) {
		return this.mainHd.query('td.x-grid3-cell')[index];
	},

	updateSortIcon : function(col, dir) {
		var sc = this.sortClasses;
		var hds = this.mainHd.select('td.x-grid3-cell').removeClass(sc);
		hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
	}
});

Ext.os = function() {
	var msgCt;
	return {
		msg : function(title, msgList, id) {
			var store = new Ext.data.JsonStore({
						data : msgList,
						root : 'JMS_MessageText',
						autoLoad : true,
						fields : ['text', 'msgType', 'sender', 'sendTime']
			});
			var tpl = new Ext.XTemplate(
					'<tpl for=".">', // jiang20101026
					'<table width="268" ><tr>',
					'<td width="62%" rowspan="3" align="left"><font size=2 color=#FF5511>{text}</font></td>',
					'<td ><font size=2 color=#cc7033><b>{msgType}</b></font></td> </tr><tr>',
					'<td width="38%" height=10>{sender}</td> </tr>',
					'<tr><td  height=10><font style="font-size:10px;">{sendTime}</font></td></tr>',
					'</table>', '<hr width=268 align="center">', '</tpl>');
			Ext.DomHelper.insertFirst(document.body, {
						id : 'msg-div'
					}, true);

					
			if (Ext.getCmp(id)) {
				// wuxiaoxu 20111021 为了不让消息窗口在刷新消息的时候不会跑到其它模态窗口的上边通过替换数据源来实现刷消息
				Ext.getCmp(id).remove(Ext.getCmp(id + 'DataView'));
				var newDataView =  new Ext.DataView({
									id : id + 'DataView',
									store : store,
									tpl : tpl,
									width : 260,
									height : 236,
									multiSelect : true,
									// overClass : 'x-view-over',
									itemSelector : 'div.thumb-wrap'
								}) ;
				Ext.getCmp(id).add(newDataView) ;
				Ext.getCmp(id).setTitle(title + '(' + msgList.JMS_MessageText.length + '条)') ;
				Ext.getCmp(id).doLayout() ;
				// wuxiaoxu 20100709 添加消息提示音
				try {
					document.getElementById('JMS_audio').play();
				} catch (e) {
				}
				Ext.os.changTitle.start();
				return ;
				// wuxiaoxu 20111021 为了不让消息窗口在刷新消息的时候不会跑到其它模态窗口的上边通过替换数据源来实现刷消息 end
			}
			if (!Ext.getCmp(id)) {
				// xiaoxiong 20100527 解决门户窗体不弹出问题 xiaoxiong 20100723
				// 给消息窗体添加暂不提醒功能
				if (Ext.get('x-desktop').getRight() == 0) {
					new Ext.Window({
						id : id,
						title : title + '(' + msgList.JMS_MessageText.length
								+ '条)',
						width : 300,
						height : 270,
						// pageX : window.screen.availWidth - 312,
						// pageY : window.screen.availHeight - 362,
						pageX : Ext.getCmp('maintabs').getInnerWidth() - 91,// xiaoxiong
																			// 20100601
																			// edit
						pageY : Ext.getCmp('maintabs').getInnerHeight() - 188,// xiaoxiong
																				// 20100601
																				// edit
						animateTarget : 'clear',
						autoScroll : true,
						resizable : true,
						tools : [{// wuxiaoxu 201001011 门户模式下弹出消息管理窗口
							id : 'gear',
							qtip : '\u6d88\u606f\u7ba1\u7406',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('gear', this);
							}
						}, {
							id : 'pin',
							qtip : '\u6682\u4e0d\u63d0\u9192',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('pin', this);
							}
								// xiaoxiong 20110503 修改消息窗体有上角按钮的展现
							}, {
							id : 'close',
							hidden : true,
							qtip : '\u6d88\u606f\u7ba1\u7406',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('gear', this);
							}
						}
						// end
						],
						listeners : {
							'pin' : function() {
								// wuxiaoxu 20100901 修改提示信息
								// Ext.Msg.confirm('\u6d88\u606f',
								// '\u6267\u884c\u6b64\u64cd\u4f5c\u540e\u6d88\u606f\u7a97\u4f53\u5c06\u5728\u6709\u65b0\u6d88\u606f\u65f6\u624d\u4f1a\u518d\u5f39\u51fa\uff01\u60a8\u786e\u5b9a\u8981\u6267\u884c\u6682\u4e0d\u63d0\u9192\u64cd\u4f5c\u5417\uff1f',
								// function(btn){
								Ext.Msg
										.confirm(
												'\u6d88\u606f',
												'\u6267\u884c\u6b64\u64cd\u4f5c\u540e\u6d88\u606f\u7a97\u4f53\u5c06\u5728\u5237\u65b0\u9875\u9762\u6216\u6709\u65b0\u6d88\u606f\u65f6\u624d\u4f1a\u518d\u5f39\u51fa\uff01\u60a8\u786e\u5b9a\u8981\u6267\u884c\u6682\u4e0d\u63d0\u9192\u64cd\u4f5c\u5417\uff1f',
												function(btn) {
													if (btn == 'yes') {
														notRemind = 1;
														Ext.getCmp(id).close();
													}
												})
							},
							// wuxiaoxu 201001011 门户模式下弹出消息管理窗口
							'gear' : function() {
								if (!Ext.getCmp('MessageManage_win')) {
									new Ext.Window({
										id : 'MessageManage_win',
										title : '消息管理',
										width : 1024,
										height : 712,
										iconCls : 'MessageManage',
										shim : false,
										buttonAlign : 'center',
										animCollapse : false,
										modal : true,
										constrainHeader : true,
										autoLoad : {
											url : 'messageManage.html',
											params : {
												parentWinId : 'MessageManage_win'
											},
											nocache : true,
											scripts : true
										},
										autoScroll : true
									});
								}
								Ext.getCmp('MessageManage_win').show();
							}
						},
						items : new Ext.DataView({
									id : id + 'DataView',
									store : store,
									tpl : tpl,
									width : 260,
									height : 236,
									multiSelect : true,
									// overClass : 'x-view-over',
									itemSelector : 'div.thumb-wrap'
								})

					});
					Ext.getCmp(id).addEvents('pin');
				} else {
					// end
					new Ext.Window({
						id : id,
						title : title + '(' + msgList.JMS_MessageText.length
								+ '条)',
						width : 300,
						height : 270,
						pageX : Ext.get('x-desktop').getRight() - 300,
						pageY : Ext.get('x-desktop').getBottom() - 270,
						animateTarget : 'clear',
						autoScroll : true,
						resizable : false,
						tools : [{// wuxiaoxu 20100902 弹出消息管理窗口
							id : 'gear',
							qtip : '\u6d88\u606f\u7ba1\u7406',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('gear', this);
							}
						}, {
							id : 'pin',
							qtip : '\u6682\u4e0d\u63d0\u9192',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('pin', this);
							}
								// xiaoxiong 20110503 修改消息窗体有上角按钮的展现
							}, {
							id : 'close',
							hidden : true,
							qtip : '\u6d88\u606f\u7ba1\u7406',
							handler : function(event, toolEl, panel) {
								Ext.getCmp(id).fireEvent('gear', this);
							}
						}
						// end
						],
						listeners : {
							'pin' : function() {
								// wuxiaoxu 20100901 修改提示信息
								// Ext.Msg.confirm('\u6d88\u606f',
								// '\u6267\u884c\u6b64\u64cd\u4f5c\u540e\u6d88\u606f\u7a97\u4f53\u5c06\u5728\u6709\u65b0\u6d88\u606f\u65f6\u624d\u4f1a\u518d\u5f39\u51fa\uff01\u60a8\u786e\u5b9a\u8981\u6267\u884c\u6682\u4e0d\u63d0\u9192\u64cd\u4f5c\u5417\uff1f',
								// function(btn){
								Ext.Msg
										.confirm(
												'\u6d88\u606f',
												'\u6267\u884c\u6b64\u64cd\u4f5c\u540e\u6d88\u606f\u7a97\u4f53\u5c06\u5728\u5237\u65b0\u9875\u9762\u6216\u6709\u65b0\u6d88\u606f\u65f6\u624d\u4f1a\u518d\u5f39\u51fa\uff01\u60a8\u786e\u5b9a\u8981\u6267\u884c\u6682\u4e0d\u63d0\u9192\u64cd\u4f5c\u5417\uff1f',
												function(btn) {
													if (btn == 'yes') {
														notRemind = 1;
														Ext.getCmp(id).close();
													}
												})
							},
							'gear' : function() {
								if (!Ext.getCmp('MessageManage_win')) {
									new Ext.Window({
										id : 'MessageManage_win',
										title : '消息管理',
										width : 1024,
										height : 712,
										iconCls : 'MessageManage',
										shim : false,
										buttonAlign : 'center',
										animCollapse : false,
										modal : true,
										constrainHeader : true,
										autoLoad : {
											url : 'messageManage.html',
											params : {
												parentWinId : 'MessageManage_win'
											},
											nocache : true,
											scripts : true
										},
										autoScroll : true
									});
								}
								Ext.getCmp('MessageManage_win').show();
							}
						},
						items : new Ext.DataView({
									id : id + 'DataView',
									store : store,
									tpl : tpl,
									width : 260,
									height : 235,
									multiSelect : true,
									// overClass : 'x-view-over',
									itemSelector : 'div.thumb-wrap'
								})

					});
					Ext.getCmp(id).addEvents('pin');
				}
				Ext.getCmp(id).show();
				Ext.getCmp(id).on('close', function() {
							Ext.os.changTitle.stop();
						});
				// wuxiaoxu 20100709 添加消息提示音
				try {
					document.getElementById('JMS_audio').play();
				} catch (e) {
				}
				Ext.os.changTitle.start();

			}
		}
	};
}();



// wuxiaoxu add 20100709 有消息时，title进行闪动
Ext.os.changTitle = function() {
	var timer;
	var seed = 0;
	var currTitle = document.title;
	return {
		start : function() {
			timer = setInterval(function() {
						seed = seed >100 ?0:seed++;//wuxiaoxu 20120825 modify
						if (seed % 2 == 0) {
							document.title = "您有新消息，请注意查收";
						} else {
							document.title = currTitle;
						}
					}, 2000);
		},
		stop : function() {
			clearInterval(timer);
			document.title = currTitle;
		}
	}
}();

/*
 * Ext JS Library 2.2.1 Copyright(c) 2006-2009, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.form.FileUploadField = Ext.extend(Ext.form.TextField, {
			/**
			 * @cfg {String} buttonText The button text to display on the upload
			 *      button (defaults to 'Browse...'). Note that if you supply a
			 *      value for {@link #buttonCfg}, the buttonCfg.text value will
			 *      be used instead if available.
			 */
			buttonText : 'Browse...',
			/**
			 * @cfg {Boolean} buttonOnly True to display the file upload field
			 *      as a button with no visible text field (defaults to false).
			 *      If true, all inherited TextField members will still be
			 *      available.
			 */
			buttonOnly : false,
			/**
			 * @cfg {Number} buttonOffset The number of pixels of space reserved
			 *      between the button and the text field (defaults to 3). Note
			 *      that this only applies if {@link #buttonOnly} = false.
			 */
			buttonOffset : 3,
			/**
			 * @cfg {Object} buttonCfg A standard {@link Ext.Button} config
			 *      object.
			 */

			// private
			readOnly : true,

			/**
			 * @hide
			 * @method autoSize
			 */
			autoSize : Ext.emptyFn,

			// private
			initComponent : function() {
				Ext.form.FileUploadField.superclass.initComponent.call(this);

				this.addEvents(
						/**
						 * @event fileselected Fires when the underlying file
						 *        input field's value has changed from the user
						 *        selecting a new file from the system file
						 *        selection dialog.
						 * @param {Ext.form.FileUploadField}
						 *            this
						 * @param {String}
						 *            value The file value returned by the
						 *            underlying file input field
						 */
						'fileselected');
			},

			// private
			onRender : function(ct, position) {
				Ext.form.FileUploadField.superclass.onRender.call(this, ct,
						position);

				this.wrap = this.el.wrap({
							cls : 'x-form-field-wrap x-form-file-wrap'
						});
				this.el.addClass('x-form-file-text');
				this.el.dom.removeAttribute('name');

				this.fileInput = this.wrap.createChild({
							id : this.getFileInputId(),
							name : this.name || this.getId(),
							cls : 'x-form-file',
							tag : 'input',
							type : 'file',
							size : 1
						});

				var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
							text : this.buttonText
						});
				this.button = new Ext.Button(Ext.apply(btnCfg, {
							renderTo : this.wrap,
							cls : 'x-form-file-btn'
									+ (btnCfg.iconCls ? ' x-btn-icon' : '')
						}));

				if (this.buttonOnly) {
					this.el.hide();
					this.wrap.setWidth(this.button.getEl().getWidth());
				}

				this.fileInput.on('change', function() {
							var v = this.fileInput.dom.value;
							this.setValue(v);
							this.fireEvent('fileselected', this, v);
						}, this);
			},

			// private
			getFileInputId : function() {
				return this.id + '-file';
			},

			// private
			onResize : function(w, h) {
				Ext.form.FileUploadField.superclass.onResize.call(this, w, h);

				this.wrap.setWidth(w);

				if (!this.buttonOnly) {
					var w = this.wrap.getWidth()
							- this.button.getEl().getWidth()
							- this.buttonOffset;
					this.el.setWidth(w);
				}
			},

			// private
			preFocus : Ext.emptyFn,

			// private
			getResizeEl : function() {
				return this.wrap;
			},

			// private
			getPositionEl : function() {
				return this.wrap;
			},

			// private
			alignErrorIcon : function() {
				this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
			}

		});
Ext.reg('fileuploadfield', Ext.form.FileUploadField);

/*******************************************************************************
 * jiang add upload files 20090811
 ******************************************************************************/

/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 * 
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,
 * http://www.vinterwebb.se/
 * 
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz?n and Mammon Media and is
 * released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT
 * License: http://www.opensource.org/licenses/mit-license.php
 * 
 */

/* ******************* */
/* Constructor & Init */
/* ******************* */
var SWFUpload;

if (SWFUpload == undefined) {
	SWFUpload = function(settings) {
		this.initSWFUpload(settings);
	};
}

SWFUpload.prototype.initSWFUpload = function(settings) {
	try {
		this.customSettings = {}; // A container where developers can place
		// their own settings associated with this
		// instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;

		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings. Load the Flash movie.
		this.initSettings();
		this.loadFlash();
		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Beta 3";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED : -100,
	FILE_EXCEEDS_SIZE_LIMIT : -110,
	ZERO_BYTE_FILE : -120,
	INVALID_FILETYPE : -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR : -200,
	MISSING_UPLOAD_URL : -210,
	IO_ERROR : -220,
	SECURITY_ERROR : -230,
	UPLOAD_LIMIT_EXCEEDED : -240,
	UPLOAD_FAILED : -250,
	SPECIFIED_FILE_ID_NOT_FOUND : -260,
	FILE_VALIDATION_FAILED : -270,
	FILE_CANCELLED : -280,
	UPLOAD_STOPPED : -290
};
SWFUpload.FILE_STATUS = {
	QUEUED : -1,
	IN_PROGRESS : -2,
	ERROR : -3,
	COMPLETE : -4,
	CANCELLED : -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
};
SWFUpload.CURSOR = {
	ARROW : -1,
	HAND : -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW : "window",
	TRANSPARENT : "transparent",
	OPAQUE : "opaque"
};

/* ******************** */
/* Instance Members */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function() {
	this.ensureDefault = function(settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined)
				? defaultValue
				: this.settings[settingName];
	};

	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	this.ensureDefault("http_success", []);

	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0); // Default zero means
	// "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("prevent_swf_caching", true);

	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", null);
	this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
	this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);

	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug; // Here to maintain v2
	// API

	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);

	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);

	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;

	// Update the flash url if needed
	if (this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + "?swfuploadrnd="
				+ Math.floor(Math.random() * 999999999);
	}

	delete this.ensureDefault;
};

SWFUpload.prototype.loadFlash = function() {
	if (this.settings.button_placeholder_id !== "") {
		this.replaceWithFlash();
	} else {
		this.appendFlash();
	}
};

// Private: appendFlash gets the HTML tag for the Flash
// It then appends the flash to the body
SWFUpload.prototype.appendFlash = function() {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already
	// exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName
				+ " is already in use. The Flash Object could not be added";
	}

	// Get the body tag where we will be adding the flash movie
	targetElement = document.getElementsByTagName("body")[0];

	if (targetElement == undefined) {
		throw "Could not find the 'body' element.";
	}

	// Append the container and load the flash
	container = document.createElement("div");
	container.style.width = "1px";
	container.style.height = "1px";
	container.style.overflow = "hidden";

	targetElement.appendChild(container);
	container.innerHTML = this.getFlashHTML(); // Using innerHTML is
	// non-standard but the only
	// sensible way to dynamically
	// add Flash in IE (and maybe
	// other browsers)

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}

};

// Private: replaceWithFlash replaces the button_placeholder element with the
// flash movie.
SWFUpload.prototype.replaceWithFlash = function() {
	var targetElement, tempParent;

	// Make sure an element with the ID we are going to use doesn't already
	// exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName
				+ " is already in use. The Flash Object could not be added";
	}

	// Get the element where we will be placing the flash movie
	targetElement = document
			.getElementById(this.settings.button_placeholder_id);

	if (targetElement == undefined) {
		throw "Could not find the placeholder element.";
	}

	// Append the container and load the flash
	tempParent = document.createElement("div");
	tempParent.innerHTML = this.getFlashHTML(); // Using innerHTML is
	// non-standard but the only
	// sensible way to dynamically
	// add Flash in IE (and maybe
	// other browsers)
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}

};

// Private: getFlashHTML generates the object tag needed to embed the flash in
// to the document
SWFUpload.prototype.getFlashHTML = function() {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName,
			'" type="application/x-shockwave-flash" data="',
			this.settings.flash_url, '" width="', this.settings.button_width,
			'" height="', this.settings.button_height, '" class="swfupload">',
			'<param name="wmode" value="', this.settings.button_window_mode,
			'" />', '<param name="movie" value="', this.settings.flash_url,
			'" />', '<param name="quality" value="high" />',
			'<param name="menu" value="false" />',
			'<param name="allowScriptAccess" value="always" />',
			'<param name="flashvars" value="' + this.getFlashVars() + '" />',
			'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function() {
	// Build a string from the post param object
	var paramString = this.buildParamString();
	var httpSuccessString = this.settings.http_success.join(",");

	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=",
			encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=",
			encodeURIComponent(this.settings.requeue_on_error),
			"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=",
			encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=",
			encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=",
			encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=",
			encodeURIComponent(this.settings.file_upload_limit),
			"&amp;fileQueueLimit=",
			encodeURIComponent(this.settings.file_queue_limit),
			"&amp;debugEnabled=",
			encodeURIComponent(this.settings.debug_enabled),
			"&amp;buttonImageURL=",
			encodeURIComponent(this.settings.button_image_url),
			"&amp;buttonWidth=",
			encodeURIComponent(this.settings.button_width),
			"&amp;buttonHeight=",
			encodeURIComponent(this.settings.button_height),
			"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			"&amp;buttonTextTopPadding=",
			encodeURIComponent(this.settings.button_text_top_padding),
			"&amp;buttonTextLeftPadding=",
			encodeURIComponent(this.settings.button_text_left_padding),
			"&amp;buttonTextStyle=",
			encodeURIComponent(this.settings.button_text_style),
			"&amp;buttonAction=",
			encodeURIComponent(this.settings.button_action),
			"&amp;buttonDisabled=",
			encodeURIComponent(this.settings.button_disabled),
			"&amp;buttonCursor=",
			encodeURIComponent(this.settings.button_cursor)].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element
// added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function() {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}

	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params
// setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function() {
	var postParams = this.settings.post_params;
	var paramStringPairs = [];

	if (typeof(postParams) === "object") {
		for (var name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "="
						+ encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method
// strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs
// leaving SWFUpload in an inconsistant state.
// Credits: Major improvements provided by steffen
SWFUpload.prototype.destroy = function() {
	try {
		// Make sure Flash is done before we try to remove it
		this.cancelUpload(null, false);

		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		movieElement = this.getMovieElement();

		if (movieElement) {
			// Loop through all the movie's properties and remove all function
			// references (DOM/JS IE 6/7 memory leak workaround)
			for (var i in movieElement) {
				try {
					if (typeof(movieElement[i]) === "function") {
						movieElement[i] = null;
					}
				} catch (ex1) {
				}
			}

			// Remove the Movie Element from the page
			try {
				movieElement.parentNode.removeChild(movieElement);
			} catch (ex) {
			}
		}

		// Remove IE form fix reference
		window[this.movieName] = null;

		// Destroy other references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		this.movieElement = null;
		this.settings = null;
		this.customSettings = null;
		this.eventQueue = null;
		this.movieName = null;

		return true;
	} catch (ex1) {
		return false;
	}
};

// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function() {
	this.debug([
			"---SWFUpload Instance Info---\n",
			"Version: ",
			SWFUpload.version,
			"\n",
			"Movie Name: ",
			this.movieName,
			"\n",
			"Settings:\n",
			"\t",
			"upload_url:               ",
			this.settings.upload_url,
			"\n",
			"\t",
			"flash_url:                ",
			this.settings.flash_url,
			"\n",
			"\t",
			"use_query_string:         ",
			this.settings.use_query_string.toString(),
			"\n",
			"\t",
			"requeue_on_error:         ",
			this.settings.requeue_on_error.toString(),
			"\n",
			"\t",
			"http_success:             ",
			this.settings.http_success.join(", "),
			"\n",
			"\t",
			"file_post_name:           ",
			this.settings.file_post_name,
			"\n",
			"\t",
			"post_params:              ",
			this.settings.post_params.toString(),
			"\n",
			"\t",
			"file_types:               ",
			this.settings.file_types,
			"\n",
			"\t",
			"file_types_description:   ",
			this.settings.file_types_description,
			"\n",
			"\t",
			"file_size_limit:          ",
			this.settings.file_size_limit,
			"\n",
			"\t",
			"file_upload_limit:        ",
			this.settings.file_upload_limit,
			"\n",
			"\t",
			"file_queue_limit:         ",
			this.settings.file_queue_limit,
			"\n",
			"\t",
			"debug:                    ",
			this.settings.debug.toString(),
			"\n",

			"\t",
			"prevent_swf_caching:      ",
			this.settings.prevent_swf_caching.toString(),
			"\n",

			"\t",
			"button_placeholder_id:    ",
			this.settings.button_placeholder_id.toString(),
			"\n",
			"\t",
			"button_image_url:         ",
			this.settings.button_image_url.toString(),
			"\n",
			"\t",
			"button_width:             ",
			this.settings.button_width.toString(),
			"\n",
			"\t",
			"button_height:            ",
			this.settings.button_height.toString(),
			"\n",
			"\t",
			"button_text:              ",
			this.settings.button_text.toString(),
			"\n",
			"\t",
			"button_text_style:        ",
			this.settings.button_text_style.toString(),
			"\n",
			"\t",
			"button_text_top_padding:  ",
			this.settings.button_text_top_padding.toString(),
			"\n",
			"\t",
			"button_text_left_padding: ",
			this.settings.button_text_left_padding.toString(),
			"\n",
			"\t",
			"button_action:            ",
			this.settings.button_action.toString(),
			"\n",
			"\t",
			"button_disabled:          ",
			this.settings.button_disabled.toString(),
			"\n",

			"\t",
			"custom_settings:          ",
			this.settings.custom_settings.toString(),
			"\n",
			"Event Handlers:\n",
			"\t",
			"swfupload_loaded_handler assigned:  ",
			(typeof this.settings.swfupload_loaded_handler === "function")
					.toString(),
			"\n",
			"\t",
			"file_dialog_start_handler assigned: ",
			(typeof this.settings.file_dialog_start_handler === "function")
					.toString(),
			"\n",
			"\t",
			"file_queued_handler assigned:       ",
			(typeof this.settings.file_queued_handler === "function")
					.toString(),
			"\n",
			"\t",
			"file_queue_error_handler assigned:  ",
			(typeof this.settings.file_queue_error_handler === "function")
					.toString(),
			"\n",
			"\t",
			"upload_start_handler assigned:      ",
			(typeof this.settings.upload_start_handler === "function")
					.toString(),
			"\n",
			"\t",
			"upload_progress_handler assigned:   ",
			(typeof this.settings.upload_progress_handler === "function")
					.toString(),
			"\n",
			"\t",
			"upload_error_handler assigned:      ",
			(typeof this.settings.upload_error_handler === "function")
					.toString(),
			"\n",
			"\t",
			"upload_success_handler assigned:    ",
			(typeof this.settings.upload_success_handler === "function")
					.toString(),
			"\n",
			"\t",
			"upload_complete_handler assigned:   ",
			(typeof this.settings.upload_complete_handler === "function")
					.toString(), "\n", "\t",
			"debug_handler assigned:             ",
			(typeof this.settings.debug_handler === "function").toString(),
			"\n"].join(""));
};

/*
 * Note: addSetting and getSetting are no longer used by SWFUpload but are
 * included the maintain v2 API compatibility
 */
// Public: (Deprecated) addSetting adds a setting value. If the value given is
// undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function(name, value, default_value) {
	if (value == undefined) {
		return (this.settings[name] = default_value);
	} else {
		return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if
// the setting was not found.
SWFUpload.prototype.getSetting = function(name) {
	if (this.settings[name] != undefined) {
		return this.settings[name];
	}

	return "";
};

// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function(functionName, argumentArray) {
	argumentArray = argumentArray || [];

	var movieElement = this.getMovieElement();
	var returnValue, returnString;

	// Flash's method if calling ExternalInterface methods (code adapted from
	// MooTools).
	try {
		returnString = movieElement.CallFunction('<invoke name="'
				+ functionName + '" returntype="javascript">'
				+ __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
		returnValue = eval(returnString);
	} catch (ex) {
		throw "Call to " + functionName + " failed";
	}

	// Unescape file post param values
	if (returnValue != undefined && typeof returnValue.post === "object") {
		returnValue = this.unescapeFilePostParams(returnValue);
	}

	return returnValue;
};

/*******************************************************************************
 * -- Flash control methods -- Your UI should use these to operate SWFUpload
 ******************************************************************************/

// WARNING: this function does not work in Flash Player 10
// Public: selectFile causes a File Selection Dialog window to appear. This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function() {
	this.callFlash("SelectFile");
};

// WARNING: this function does not work in Flash Player 10
// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the
// combined length of the file names.
// If the selection name length is too long the dialog will fail in an
// unpredictable manner. There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function() {
	this.callFlash("SelectFiles");
};

// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID
SWFUpload.prototype.startUpload = function(fileID) {
	this.callFlash("StartUpload", [fileID]);
};

// Public: cancelUpload cancels any queued file. The fileID parameter may be the
// file ID or index.
// If you do not specify a fileID the current uploading file or first file in
// the queue is cancelled.
// If you do not want the uploadError event to trigger you can specify false for
// the triggerErrorEvent parameter.
SWFUpload.prototype.cancelUpload = function(fileID, triggerErrorEvent) {
	if (triggerErrorEvent !== false) {
		triggerErrorEvent = true;
	}
	this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
};

// Public: stopUpload stops the current upload and requeues the file at the
// beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function() {
	this.callFlash("StopUpload");
};

/*******************************************************************************
 * Settings methods These methods change the SWFUpload settings. SWFUpload
 * settings should not be changed directly on the settings object since many of
 * the settings need to be passed to Flash in order to take effect.
 * ***********************
 */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function() {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics. You shouldn't need to
// change the statistics but you can. Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function(statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index. If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function(fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID. If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function(fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function(fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function(url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function(paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair. Each name can have only one
// value.
SWFUpload.prototype.addPostParam = function(name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function(name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the
// file_types_description setting
SWFUpload.prototype.setFileTypes = function(types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function(fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function(fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function(fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function(filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function(useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function(requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setHTTPSuccess = function(http_status_codes) {
	if (typeof http_status_codes === "string") {
		http_status_codes = http_status_codes.replace(" ", "").split(",");
	}

	this.settings.http_success = http_status_codes;
	this.callFlash("SetHTTPSuccess", [http_status_codes]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function(debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function(buttonImageURL) {
	if (buttonImageURL == undefined) {
		buttonImageURL = "";
	}

	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function(width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;

	var movie = this.getMovieElement();
	if (movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}

	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function(html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text
// overlay
SWFUpload.prototype.setButtonTextPadding = function(left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text
// overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function(css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function(isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is
// clicked
SWFUpload.prototype.setButtonAction = function(buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

// Public: setButtonCursor changes the mouse cursor displayed when hovering over
// the button
SWFUpload.prototype.setButtonCursor = function(cursor) {
	this.settings.button_cursor = cursor;
	this.callFlash("SetButtonCursor", [cursor]);
};

/*******************************************************************************
 * Flash Event Interfaces These functions are used by Flash to trigger the
 * various events.
 * 
 * All these functions a Private.
 * 
 * Because the ExternalInterface library is buggy the event calls are added to a
 * queue and the queue then executed by a setTimeout. This ensures that events
 * are executed in a determinate order and that the ExternalInterface bugs are
 * avoided.
 ******************************************************************************/

SWFUpload.prototype.queueEvent = function(handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite
	// loop

	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}

	var self = this;
	if (typeof this.settings[handlerName] === "function") {
		// Queue the event
		this.eventQueue.push(function() {
					this.settings[handlerName].apply(this, argumentArray);
				});

		// Execute the next queued event
		setTimeout(function() {
					self.executeNextEvent();
				}, 0);

	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName
				+ " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed. Since events are
// queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function() {
	// Warning: Don't call this.debug inside here or you'll create an infinite
	// loop

	var f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where
// objects passed through ExternalInterface cannot have
// properties that contain characters that are not valid for JavaScript
// identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again
// before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function(file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if (file != undefined) {
		for (var k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x"
											+ match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

SWFUpload.prototype.flashReady = function() {
	// Check that the movie element is loaded correctly with its
	// ExternalInterface methods defined
	var movieElement = this.getMovieElement();

	// Pro-actively unhook all the Flash functions
	if (typeof(movieElement.CallFunction) === "unknown") { // We only want to
		// do this in IE
		this
				.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
		for (var key in movieElement) {
			try {
				if (typeof(movieElement[key]) === "function") {
					movieElement[key] = null;
				}
			} catch (ex) {
			}
		}
	}

	this.queueEvent("swfupload_loaded_handler");
};

/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function() {
	this.queueEvent("file_dialog_start_handler");
};

/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};

/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function(file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/*
 * Called after the file dialog has closed and the selected files have been
 * queued. You could call startUpload here if you want the queued files to begin
 * uploading immediately.
 */
SWFUpload.prototype.fileDialogComplete = function(numFilesSelected,
		numFilesQueued) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected,
					numFilesQueued]);
};

SWFUpload.prototype.uploadStart = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function(file) {
	var returnValue;
	if (typeof this.settings.upload_start_handler === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the
	// upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}

	returnValue = !!returnValue;

	this.callFlash("ReturnUploadStart", [returnValue]);
};

SWFUpload.prototype.uploadProgress = function(file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler",
			[file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function(file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function(file, serverData) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData]);
};

SWFUpload.prototype.uploadComplete = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/*
 * Called by SWFUpload JavaScript and Flash functions when debug is enabled. By
 * default it writes messages to the internal debug console. You can override
 * this event and have messages written where you want.
 */
SWFUpload.prototype.debug = function(message) {
	this.queueEvent("debug_handler", message);
};

/*******************************************************************************
 * Debug Console The debug console is a self contained, in page location for
 * debug message to be sent. The Debug Console adds itself to the body if
 * necessary.
 * 
 * The console is automatically scrolled as messages appear.
 * 
 * If you are using your own debug handler or when you deploy to production and
 * have debug disabled you can remove these functions to reduce the file size
 * and complexity.
 ******************************************************************************/

// Private: debugMessage is the default debug_handler. If you want to print
// debug messages
// call the debug() function. When overriding the function your own function
// should
// check to see if the debug setting is true before outputting debug
// information.
SWFUpload.prototype.debugMessage = function(message) {
	if (this.settings.debug) {
		var exceptionMessage, exceptionValues = [];

		// Check for an exception object and print it nicely
		if (typeof message === "object" && typeof message.name === "string"
				&& typeof message.message === "string") {
			for (var key in message) {
				if (message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: "
					+ exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function(message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if (!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "monospace";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};
// //////////////////////////////////////////////////////////////////////////////////

/**
 * @class Ext.ux.SwfUploadPanel
 * @extends Ext.grid.GridPanel
 * 
 * Makes a Panel to provide the ability to upload multiple files using the
 * SwfUpload flash script.
 * 
 * @author jiang
 * @website http://www.flyingsoft.cn
 * @created 2009-08-12
 * @version 1.0
 * 
 * known_issues - Progress bar used hardcoded width. Not sure how to make 100%
 * in bbar - Panel requires width / height to be set. Not sure why it will not
 * fit - when panel is nested sometimes the column model is not always shown to
 * fit until a file is added. Render order issue.
 * 
 * @constructor
 * @param {Object}
 *            config The config object
 */
/*
 * var aa = new Ext.form.ComboBox({ id : 'filetype_', triggerAction : 'all', //
 * 单击触发按钮显示全部数据 store : new Ext.data.SimpleStore({ id : 'combo_id', fields :
 * ['display'], // 注意：这里定义的键值必须与下面的属性(displayField:valueField)对应 data : [["正文",
 * "正文"], ["附件", "附件"], ["处理单", "处理单"]] }), // 数据源 displayField : 'display', //
 * 定义显示的字段 width : 70, // 设置宽度 mode : 'local',// 本地模式 远程:remote typeAhead :
 * true, // 允许自动选择匹配的剩余部分文本 value : "附件",// 默认选择值 selectOnFocus : true,//
 * 用户不能自己输入,只能选择列表中有的记录 readOnly : true, // forceSelection : true //
 * 要求输入的值必须在列表中存在 });
 */
var comBoxflag = false;
Ext.ux.SwfUploadPanel = Ext.extend(Ext.grid.EditorGridPanel, {

	/**
	 * @cfg {Object} strings All strings used by Ext.ux.SwfUploadPanel
	 */

	strings : {
		text_add : '增加文件',
		text_upload : '上传',
		text_cancel : '取消',
		text_clear : '清空',
		text_progressbar : '进 度 条',
		text_remove : '删除文件',
		text_remove_sure : 'Are you sure you wish to remove this file from queue?',
		text_error : '错误',
		text_uploading : '正在上传的文件: {0} ({1} of {2})',
		header_filename : '文件名称',
		header_size : '大小',
		header_status : '状态',
		header_fileType : '文件类别',

		status : {
			0 : '准备',
			1 : '正在上传...',
			2 : '完成',
			3 : '出错',
			4 : 'Cancelled',
			5 : '连接FTP服务器失败,请检查权限或配置',// zhangyuanxi 20100510 edit
										// 如果用户没有文件访问角色的友好提示
			6 : '失败，没有定义扫描规则',
			7 : '失败，没有定义命名规则',
			8 : '文件写入出错',
			9 : '保存数据出错',
			10 : 'MD5文件校验出错',
			11 : '上传文件出现异常',
			12 : '根据命名规则创建文件夹出错',
			13 : '没有权限，不能操作电子文件',// zhangyuanxi 20100510 add 如果用户没有文件访问角色的友好提示
			14 : '请先在格式注册功能中注册此格式'// zhangyuanxi 20111014 add 如果用户在格式注册中没有添加格式，就提示注册格式
		},
		error_queue_slots_0 : 'There is no slot left',
		error_queue_slots_1 : 'There is only one slot left',
		error_queue_slots_2 : 'There are only {0} slots left',
		/*
		 * shilongfei 20101118 修正提示信息为中文 error_queue_exceeded : 'The selected
		 * file(s) exceed(s) the maximum number of {0} queued files.',
		 * error_size_exceeded : 'The selected files size exceeds the allowed
		 * limit of {0}.', error_zero_byte_file : 'Zero byte file selected.',
		 * error_invalid_filetype : 'Invalid filetype selected.',
		 * error_file_not_found : 'File not found 404.', error_security_error :
		 * 'Security Error. Not allowed to post to different url.'
		 */
		error_queue_exceeded : '上传文件的数量超过最大限制 {0}。',
		error_size_exceeded : '选择文件的大小超过最大限制 {0}。',
		error_zero_byte_file : '您选择的文件为0字节，请您重新选择！',// zhengfang 20100927
													// 选择的附加文件为0字节时，提示信息为英文
		error_invalid_filetype : '选择的文件类型暂不支持。',
		error_file_not_found : '未找到选择的文件。',
		error_security_error : '安全警告：不允许粘贴URL！'
	},

	/**
	 * @cfg {Boolean} single_select True to allow multiple file selections,
	 *      false for single file selection. Please note that this doesn't
	 *      affect the number of allowed files in the queue. Use the
	 *      {@link #file_queue_limit} parameter to change the allowed number of
	 *      files in the queue.
	 */
	single_select : false,
	/**
	 * @cfg {Boolean} confirm_delete Show a confirmation box on deletion of
	 *      queued files.
	 */
	confirm_delete : true,
	/**
	 * @cfg {String} file_types Allowed file types for the File Selection
	 *      Dialog. Use semi-colon as a seperator for multiple file-types.
	 */
	file_types : "*.*", // Default allow all file types
	/**
	 * @cfg {String} file_types A text description that is displayed to the user
	 *      in the File Browser dialog.
	 */
	file_types_description : "All Files", // 
	/**
	 * @cfg {String} file_size_limit The file_size_limit setting defines the
	 *      maximum allowed size of a file to be uploaded. This setting accepts
	 *      a value and unit. Valid units are B, KB, MB and GB. If the unit is
	 *      omitted default is KB. A value of 0 (zero) is interpretted as
	 *      unlimited.
	 */
	file_size_limit : "1048576", // Default size limit 100MB
	/**
	 * @cfg {String} file_upload_limit Defines the number of files allowed to be
	 *      uploaded by SWFUpload. This setting also sets the upper bound of the
	 *      {@link #file_queue_limit} setting. The value of 0 (zero) is
	 *      interpretted as unlimited.
	 */
	file_upload_limit : "0", // Default no upload limit
	/**
	 * @cfg {String} file_queue_limit Defines the number of unprocessed files
	 *      allowed to be simultaneously queued. The value of 0 (zero) is
	 *      interpretted as unlimited.
	 */
	file_queue_limit : "0", // Default no queue limit
	/**
	 * @cfg {String} file_post_name The file_post_name allows you to set the
	 *      value name used to post the file.
	 */
	file_post_name : "Filedata", // Default name
	/**
	 * @cfg {String} flash_url The full, absolute, or relative URL to the Flash
	 *      Control swf file.
	 */
	flash_url : "swfupload.swf", // Default url, relative to the page url
	/**
	 * @cfg {Boolean} debug A boolean value that defines whether the debug event
	 *      handler should be fired.
	 */
	debug : false,

	// standard grid parameters
	autoExpandColumn : 'name',
	enableColumnResize : false,
	enableColumnMove : false,

	// private
	upload_cancelled : false,

	// private
	initComponent : function() {
		this.addEvents(
				/**
				 * @event swfUploadLoaded Fires after the Flash object has been
				 *        loaded
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 */
				'swfUploadLoaded',
				/**
				 * @event swfUploadLoaded Fires after a file has been qeueud
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 * @param {Object}
				 *            file The file object that produced the error
				 */
				'fileQueued',
				/**
				 * @event startUpload Fires before the upload starts
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 */
				'startUpload',
				/**
				 * @event fileUploadError Fires after an upload has been stopped
				 *        or cancelled
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 * @param {Object}
				 *            file The file object that produced the error
				 * @param {String}
				 *            code The error code
				 * @param {String}
				 *            message Supplemental error message
				 */
				'fileUploadError',
				/**
				 * @event fileUploadSuccess Fires after an upload has been
				 *        successfully uploaded
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 * @param {Object}
				 *            file The file object that has been uploaded
				 * @param {Object}
				 *            data The response data of the upload request
				 */
				'fileUploadSuccess',
				/**
				 * @event fileUploadComplete Fires after the upload cycle for
				 *        one file finished
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 * @param {Object}
				 *            file The file object that has been uploaded
				 */
				'fileUploadComplete',
				/**
				 * @event fileUploadComplete Fires after the upload cycle for
				 *        all files in the queue finished
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 */
				'allUploadsComplete',
				/**
				 * @event fileUploadComplete Fires after one or more files have
				 *        been removed from the queue
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 */
				'removeFiles',
				/**
				 * @event fileUploadComplete Fires after all files have been
				 *        removed from the queue
				 * @param {Ext.grid.GridPanel}
				 *            grid This grid
				 */
				'removeAllFiles');

		this.rec = Ext.data.Record.create([{
					name : 'name'
				}, {
					name : 'size'
				}, {
					name : 'id'
				}, {
					name : 'type'
				}, {
					name : 'creationdate',
					type : 'date',
					dateFormat : 'm/d/Y'
				}, {
					name : 'status'
				}, {
					name : 'filetype'
				}]);
		this.store = new Ext.data.Store({
					reader : new Ext.data.JsonReader({
								id : 'id'
							}, this.rec)
				});

		this.columns = [{
					id : 'name',
					header : this.strings.header_filename,
					dataIndex : 'name'
				}, {
					id : 'size',
					header : this.strings.header_size,
					width : 80,
					dataIndex : 'size',
					renderer : this.formatBytes
				}, {
					id : 'status',
					header : this.strings.header_status,
					width : 220,
					dataIndex : 'status',
					renderer : this.formatStatus.createDelegate(this)
				},
				// tangshuang 20091224 (添加"文件类别"字段)
				{
					id : 'filetype',
					header : this.strings.header_fileType,
					dataIndex : 'filetype',
					editor : new Ext.form.ComboBox({
								id : 'filetype_',
								triggerAction : 'all', // 单击触发按钮显示全部数据
								store : new Ext.data.SimpleStore({
											id : 'combo_id',
											fields : ['display'], // 注意：这里定义的键值必须与下面的属性(displayField:valueField)对应
											data : [["正文", "正文"], ["附件", "附件"],
													["处理单", "处理单"]]
										}), // 数据源
								displayField : 'display', // 定义显示的字段
								width : 70, // 设置宽度
								mode : 'local',// 本地模式 远程:remote
								typeAhead : true, // 允许自动选择匹配的剩余部分文本
								value : "正文",// 默认选择值
								selectOnFocus : true,// 用户不能自己输入,只能选择列表中有的记录
								readOnly : true, //
								forceSelection : true, // 要求输入的值必须在列表中存在
								listeners : {
									select : function() {
										comBoxflag = false;
									}
								}

							}),
					renderer : function(value) {

						if (value) {
							if (comBoxflag) {
								return Ext.getCmp('filetype_').value = Ext
										.getCmp('SwfUploadCombo_ID').value;
							}
							return Ext.getCmp('filetype_').value = value;
							/*
							 * if (Ext.getCmp('filetype_').value != Ext
							 * .getCmp('SwfUploadCombo_ID').value) { return
							 * Ext.getCmp('filetype_').value = value; } return
							 * Ext.getCmp('filetype_').value = value = Ext
							 * .getCmp('SwfUploadCombo_ID').value;
							 */
						} else {
							return Ext.getCmp('filetype_').value = Ext
									.getCmp('SwfUploadCombo_ID').value;
							// return Ext.getCmp('filetype_').getValue() ;
						}
					}

					// end tangshuang 20091224
				}];

		this.sm = new Ext.grid.RowSelectionModel({
					singleSelect : this.single_select
				});
		this.progress_bar = new Ext.ProgressBar({
			text : this.strings.text_progressbar
				// width: this.width - 7
			});
		this.tbar = [{
					text : this.strings.text_add,
					iconCls : 'SwfUploadPanel_iconAdd',
					xhandler : function() {
						if (this.single_select) {
							this.suo.selectFile();
						} else {
							this.suo.selectFiles();
						}
					},
					xscope : this
				},

				'->', {
					text : this.strings.text_cancel,
					iconCls : 'SwfUploadPanel_iconCancel',
					handler : this.stopUpload,
					scope : this,
					hidden : true
				}, {
					text : this.strings.text_upload,
					iconCls : 'SwfUploadPanel_iconUpload',
					handler : this.startUpload,
					scope : this,
					hidden : true
				}, {
					text : this.strings.text_clear,
					iconCls : 'SwfUploadPanel_iconClear',
					handler : this.removeAllFiles,
					scope : this,
					hidden : false
				}, '-',
				//huangheng 20111215 edit 默认按照规则重命名
				'是否按规则重命名:', new Ext.form.ComboBox({
							id : 'SwfUploadCombo_IsRenameFromRule_ID',
							name : 'SwfUploadCombo_IsRenameFromRule',
							hiddenName : 'SwfUploadCombo_IsRenameFromRule',
							store : new Ext.data.SimpleStore({
										id : 'SWFUploadFile_FileType_Store',
										data : [['0', '否'], ['1', '是']],
										fields : ['value', 'display']
									}),
							valueField : 'value',
							displayField : 'display',
							value : '1',
							editable : false,
							mode : 'local',
							forceSelection : true,
							triggerAction : 'all',
							allowBlank : false,
							width : 50
						}),
				//
				'-', '文件类别:', '-', new Ext.form.ComboBox({
					id : 'SwfUploadCombo_ID',
					name : 'SwfUploadCombo',
					hiddenName : 'SwfUploadCombo',
					pid : this.id, // 获取父级(Ext.ux.SwfUploadPanel )id
					store : new Ext.data.SimpleStore({
								id : 'SWFUploadFile_FileType_Store',
								data : [['正文', '正文'], ['附件', '附件'],
										['处理单', '处理单']],
								fields : ['value', 'display']
							}),
					valueField : 'value',
					displayField : 'display',
					value : '正文',
					editable : false,
					mode : 'local',
					forceSelection : true,
					triggerAction : 'all',
					allowBlank : false,
					width : 90,
					// star tangshuang 20091229
					listeners : {
						select : function(combo, record, index) {
							comBoxflag = true;
							Ext.getCmp('filetype_').setValue(this.value);
							Ext.getCmp(this.pid).getView().refresh();

						}
						/*
						 * select : function(combo, record, index) {
						 * //comBoxStroe.each(function(Record){
						 * //alert(Record.data.type);
						 * //alert(Record.data.filetype); //Record.data.filetype =
						 * combo.getValue() ;
						 * Ext.getCmp('filetype_').setValue(record.data.value);
						 * Ext.getCmp(this.pid).getView().refresh(); //}); //
						 * /Ext.getCmp(this.pid).load(); /*if
						 * (Ext.getCmp('filetype_').value != 'undifined') {
						 * Ext.getCmp('filetype_') .setValue(record.data.value);
						 * Ext.getCmp(this.pid).getView().refresh(); } }
						 */
					}
						// end tangshuang 20091229
					})];

		this.bbar = [this.progress_bar];

		this.addListener({
					keypress : {
						fn : function(e) {
							if (this.confirm_delete) {
								if (e.getKey() == e.DELETE) {
									Ext.MessageBox.confirm(
											this.strings.text_remove,
											this.strings.text_remove_sure,
											function(e) {
												if (e == 'yes') {
													this.removeFiles();
												}
											}, this);
								}
							} else {
								this.removeFiles(this);
							}
						},
						scope : this
					},

					// Prevent the default right click to show up in the grid.
					contextmenu : function(e) {
						e.stopEvent();
					},

					render : {
						fn : function() {
							this.resizeProgressBar();

							this.addBtn = this.getTopToolbar().items.items[0];
							this.cancelBtn = this.getTopToolbar().items.items[2];
							this.uploadBtn = this.getTopToolbar().items.items[3];
							this.clearBtn = this.getTopToolbar().items.items[4];

							this.on('resize', this.resizeProgressBar, this);
						},
						scope : this
					}
				});
		// this.on('dblclick', function(){this.removeFiles();},
		// this);//zhangyuanxi 20100510 add 添加双击删除某个上传文件的功能
		this.on('rowcontextmenu', function() {
					this.removeFiles();
				}, this);// zhangyuanxi 20100519 add 添加右击删除某几个上传文件的功能
		this.on('render', function() {
					var suoID = Ext.id();
					var em = this.addBtn.el.child('em');
					em.setStyle({
								position : 'relative',
								display : 'block'
							});
					em.createChild({
								tag : 'div',
								id : suoID
							});
					this.suo = new SWFUpload({
								button_placeholder_id : suoID,
								button_width : em.getWidth(),
								button_height : em.getHeight(),
								button_cursor : SWFUpload.CURSOR.HAND,
								button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,

								upload_url : this.upload_url,
								post_params : this.post_params,
								file_post_name : this.file_post_name,
								file_size_limit : this.file_size_limit,
								file_queue_limit : this.file_queue_limit,
								// file_types : this.file_types,
								file_types_description : this.file_types_description,
								file_upload_limit : this.file_upload_limit,
								flash_url : this.flash_url,

								// Event Handler Settings
								swfupload_loaded_handler : this.swfUploadLoaded
										.createDelegate(this),

								file_dialog_start_handler : this.fileDialogStart
										.createDelegate(this),
								file_queued_handler : this.fileQueue
										.createDelegate(this),
								file_queue_error_handler : this.fileQueueError
										.createDelegate(this),
								file_dialog_complete_handler : this.fileDialogComplete
										.createDelegate(this),

								upload_start_handler : this.uploadStart
										.createDelegate(this),
								upload_progress_handler : this.uploadProgress
										.createDelegate(this),
								upload_error_handler : this.uploadError
										.createDelegate(this),
								upload_success_handler : this.uploadSuccess
										.createDelegate(this),
								upload_complete_handler : this.uploadComplete
										.createDelegate(this),

								debug : this.debug,
								debug_handler : this.debugHandler
							});

					Ext.get(this.suo.movieName).setStyle({
								position : 'absolute',
								top : 0,
								left : 0
							});
				}, this);

		Ext.ux.SwfUploadPanel.superclass.initComponent.call(this);
	},

	// private
	resizeProgressBar : function() {
		this.progress_bar.setWidth(this.getBottomToolbar().el.getWidth() - 5);
		Ext.fly(this.progress_bar.el.dom.firstChild.firstChild)
				.applyStyles("height: 16px");
	},

	/**
	 * SWFUpload debug handler
	 * 
	 * @param {Object}
	 *            line
	 * 
	 * debugHandler: function(line) { console.log(line); },
	 */

	/**
	 * Formats file status
	 * 
	 * @param {Integer}
	 *            status
	 * @return {String}
	 */
	formatStatus : function(status) {
		return this.strings.status[status];
	},

	/**
	 * Formats raw bytes into kB/mB/GB/TB
	 * 
	 * @param {Integer}
	 *            bytes
	 * @return {String}
	 */
	formatBytes : function(size) {
		if (!size) {
			size = 0;
		}
		var suffix = ["B", "KB", "MB", "GB"];
		var result = size;
		size = parseInt(size, 10);
		result = size + " " + suffix[0];
		var loop = 0;
		while (size / 1024 > 1) {
			size = size / 1024;
			loop++;
		}
		result = Math.round(size) + " " + suffix[loop];

		return result;

		if (isNaN(bytes)) {
			return ('');
		}

		var unit, val;

		if (bytes < 999) {
			unit = 'B';
			val = (!bytes && this.progressRequestCount >= 1) ? '~' : bytes;
		} else if (bytes < 999999) {
			unit = 'kB';
			val = Math.round(bytes / 1000);
		} else if (bytes < 999999999) {
			unit = 'MB';
			val = Math.round(bytes / 100000) / 10;
		} else if (bytes < 999999999999) {
			unit = 'GB';
			val = Math.round(bytes / 100000000) / 10;
		} else {
			unit = 'TB';
			val = Math.round(bytes / 100000000000) / 10;
		}

		return (val + ' ' + unit);
	},

	/**
	 * SWFUpload swfUploadLoaded event
	 */
	swfUploadLoaded : function() {
		// if(this.debug) console.info('SWFUPLOAD LOADED');

		this.fireEvent('swfUploadLoaded', this);
	},

	/**
	 * SWFUpload fileDialogStart event
	 */
	fileDialogStart : function() {
		// if(this.debug) console.info('FILE DIALOG START');

		this.fireEvent('fileDialogStart', this);
	},

	/**
	 * Add file to store / grid SWFUpload fileQueue event
	 * 
	 * @param {Object}
	 *            file
	 */
	fileQueue : function(file) {
		// if(this.debug) console.info('FILE QUEUE');

		file.status = 0;
		r = new this.rec(file);
		r.id = file.id;
		this.store.add(r);

		this.fireEvent('fileQueued', this, file);
	},

	/**
	 * Error when file queue error occurs SWFUpload fileQueueError event
	 * 
	 * @param {Object}
	 *            file
	 * @param {Integer}
	 *            code
	 * @param {string}
	 *            message
	 */
	fileQueueError : function(file, code, message) {
		// if(this.debug) console.info('FILE QUEUE ERROR');

		switch (code) {
			case -100 :
				var slots;
				switch (message) {
					case '0' :
						slots = this.strings.error_queue_slots_0;
						break;
					case '1' :
						slots = this.strings.error_queue_slots_1;
						break;
					default :
						slots = String.format(this.strings.error_queue_slots_2,
								message);
				}
				Ext.MessageBox
						.alert(this.strings.text_error, String.format(
										this.strings.error_queue_exceeded + ' '
												+ slots, this.file_queue_limit));
				break;

			case -110 :
				Ext.MessageBox.alert(this.strings.text_error, String.format(
								this.strings.error_size_exceeded, this
										.formatBytes(this.file_size_limit
												* 1024)));
				break;

			case -120 :
				Ext.MessageBox.alert(this.strings.text_error,
						this.strings.error_zero_byte_file);
				break;

			case -130 :
				Ext.MessageBox.alert(this.strings.text_error,
						this.strings.error_invalid_filetype);
				break;
		}

		// this.fireEvent('fileQueueError', this, file, code, error);
		// zhengfang 20100927 选择的附加文件为0字节时，脚本报错error未定义
		this.fireEvent('fileQueueError', this, file, code, message);
	},

	/**
	 * SWFUpload fileDialogComplete event
	 * 
	 * @param {Integer}
	 *            file_count
	 */
	fileDialogComplete : function(file_count) {
		// if(this.debug) console.info('FILE DIALOG COMPLETE');

		if (file_count > 0) {
			this.uploadBtn.show();
		}

		this.addBtn.show();
		this.clearBtn.show();

		this.fireEvent('fileDialogComplete', this, file_count);
	},

	/**
	 * SWFUpload uploadStart event
	 * 
	 * @param {Object}
	 *            file
	 */
	uploadStart : function(file) {
		// if(this.debug) console.info('UPLOAD START');
		this.fireEvent('uploadStart', this, file);

		return true;
	},

	/**
	 * SWFUpload uploadProgress event
	 * 
	 * @param {Object}
	 *            file
	 * @param {Integer}
	 *            bytes_completed
	 * @param {Integer}
	 *            bytes_total
	 */
	uploadProgress : function(file, bytes_completed, bytes_total) {
		// if(this.debug) console.info('UPLOAD PROGRESS');

		this.store.getById(file.id).set('status', 1);
		this.store.getById(file.id).commit();
		this.progress_bar.updateProgress(bytes_completed / bytes_total, String
						.format(this.strings.text_uploading, file.name, this
										.formatBytes(bytes_completed), this
										.formatBytes(bytes_total)));

		this.fireEvent('uploadProgress', this, file, bytes_completed,
				bytes_total);
	},

	/**
	 * SWFUpload uploadError event Show notice when error occurs
	 * 
	 * @param {Object}
	 *            file
	 * @param {Integer}
	 *            error
	 * @param {Integer}
	 *            code
	 * @return {}
	 */
	uploadError : function(file, error, code) {
		// if(this.debug) console.info('UPLOAD ERROR');

		switch (error) {
			case -200 :
				Ext.MessageBox.alert(this.strings.text_error,
						this.strings.error_file_not_found);
				break;

			case -230 :
				Ext.MessageBox.alert(this.strings.text_error,
						this.strings.error_security_error);
				break;

			case -290 :
				this.store.getById(file.id).set('status', 4);
				this.store.getById(file.id).commit();
				break;
		}

		this.fireEvent('fileUploadError', this, file, error, code);
	},

	/**
	 * jiang modify 20090812 SWFUpload uploadSuccess event
	 * 
	 * @param {Object}
	 *            file
	 * @param {Object}
	 *            response
	 */
	uploadSuccess : function(file, response) {
		// if(this.debug) console.info('UPLOAD SUCCESS');
		// alert('上传成功...');//JIANG ADD 20090812
		var data = Ext.decode(response);
		var url = data.url;
		var status = data.status;
		// var filetype = Ext.getCmp('SwfUploadCombo_ID').getValue();
		// //tangshuang 20091231 ()
		var isRename = Ext.getCmp('SwfUploadCombo_IsRenameFromRule_ID')
				.getValue();
		var filetype = Ext.getCmp('filetype_').value;// tangshuang 20091231
		if (data.success) {
			this.store.remove(this.store.getById(file.id));
			Ext.Ajax.request({
						url : url,
						params : {
							filetype : filetype,
							isRename : isRename
						}
					});

		} else {
			this.store.getById(file.id).set('status', status);
			this.store.getById(file.id).commit();
			if (data.msg) {
				Ext.MessageBox.alert(this.strings.text_error, data.msg);
			}
			// alert(data.msg);//JIANG ADD 20090812
		}

		this.fireEvent('fileUploadSuccess', this, file, data);
	},

	/**
	 * SWFUpload uploadComplete event
	 * 
	 * @param {Object}
	 *            file
	 */
	uploadComplete : function(file) {
		// if(this.debug) console.info('UPLOAD COMPLETE');

		this.progress_bar.reset();
		this.progress_bar.updateText(this.strings.text_progressbar);

		if (this.suo.getStats().files_queued && !this.upload_cancelled) {
			this.suo.startUpload();
		} else {
			this.fireEvent('fileUploadComplete', this, file);

			this.allUploadsComplete();
		}

	},

	/**
	 * SWFUpload allUploadsComplete method
	 */
	allUploadsComplete : function() {
		this.cancelBtn.hide();
		this.addBtn.show();
		this.clearBtn.show();

		this.fireEvent('allUploadsComplete', this);
	},

	/**
	 * SWFUpload setPostParams method
	 * 
	 * @param {String}
	 *            name
	 * @param {String}
	 *            value
	 */
	addPostParam : function(name, value) {
		if (this.suo) {
			this.suo.settings.post_params[name] = value;
			this.suo.setPostParams(this.suo.settings.post_params);
		} else {
			this.post_params[name] = value;
		}
	},

	/**
	 * Start file upload SWFUpload startUpload method
	 */
	startUpload : function() {
		// if(this.debug) console.info('START UPLOAD');
		// jiang20100410 add
		this.addPostParam('isRename', Ext
						.getCmp('SwfUploadCombo_IsRenameFromRule_ID').value);
		this.cancelBtn.show();
		this.uploadBtn.hide();
		this.clearBtn.hide();
		// this.addBtn.hide();

		this.upload_cancelled = false;

		this.fireEvent('startUpload', this);
		// alert(this.suo.startUpload());//jiang add 20090811
		this.suo.startUpload();
	},

	/**
	 * SWFUpload stopUpload method
	 * 
	 * @param {Object}
	 *            file
	 */
	stopUpload : function(file) {
		// if(this.debug) console.info('STOP UPLOAD');

		this.suo.stopUpload();

		this.upload_cancelled = true;

		this.getStore().each(function() {
					if (this.data.status == 1) {
						this.set('status', 0);
						this.commit();
					}
				});

		this.cancelBtn.hide();
		if (this.suo.getStats().files_queued > 0) {
			this.uploadBtn.show();
		}
		this.addBtn.show();
		this.clearBtn.show();

		this.progress_bar.reset();
		this.progress_bar.updateText(this.strings.text_progressbar);

	},

	/**
	 * Delete one or multiple rows SWFUpload cancelUpload method
	 */
	removeFiles : function() {
		// if(this.debug) console.info('REMOVE FILES');

		var selRecords = this.getSelections();
		for (var i = 0; i < selRecords.length; i++) {
			if (selRecords[i].data.status != 1) {
				this.suo.cancelUpload(selRecords[i].id);
				this.store.remove(selRecords[i]);
			}
		}

		if (this.suo.getStats().files_queued === 0) {
			this.uploadBtn.hide();
			// this.clearBtn.hide();
		}

		this.fireEvent('removeFiles', this);
	},

	/**
	 * Clear the Queue SWFUpload cancelUpload method
	 */
	removeAllFiles : function() {
		// if(this.debug) console.info('REMOVE ALL');

		// mark all internal files as cancelled
		var files_left = this.suo.getStats().files_queued;

		while (files_left > 0) {
			this.suo.cancelUpload();
			files_left = this.suo.getStats().files_queued;
		}

		this.store.removeAll();

		this.cancelBtn.hide();
		this.uploadBtn.hide();
		// this.clearBtn.hide();

		this.fireEvent('removeAllFiles', this);
	}

});

// jiang add 20090825 SearchField
Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
			initComponent : function() {
				Ext.app.SearchField.superclass.initComponent.call(this);
				this.on('specialkey', function(f, e) {
							if (e.getKey() == e.ENTER) {
								// wuxiaoxu 20100518 添加搜所框验证
								if (this.validate()) {
									this.onTrigger2Click();
								}
							}
						}, this);
			},

			// validationEvent : false,
			// validateOnBlur : false,
			trigger1Class : 'x-form-clear-trigger',
			trigger2Class : 'x-form-search-trigger',
			hideTrigger1 : true,
			width : 180,
			hasSearch : false,
            //jiangyuntao 20110728 edit 修改搜索框的最大输入长度为76，参照百度的38个中文字符长度
			maxLength:76,
			paramName : 'query',
			// wuxiaoxu 20100518 添加搜所框验证
			initTrigger : function() {
				var ts = this.trigger.select('.x-form-trigger', true);
				this.wrap.setStyle('overflow', 'hidden');
				var triggerField = this;
				ts.each(function(t, all, index) {
							t.hide = function() {
								var w = triggerField.wrap.getWidth();
								this.dom.style.display = 'none';
								triggerField.el.setWidth(w
										- triggerField.trigger.getWidth());
							};
							t.show = function() {
								var w = triggerField.wrap.getWidth();
								this.dom.style.display = '';
								triggerField.el.setWidth(w
										- triggerField.trigger.getWidth());
							};
							var triggerIndex = 'Trigger' + (index + 1);
							if (this['hide' + triggerIndex]) {
								t.dom.style.display = 'none';
							}
							t.on("click", function() {
										if (index + 1 == 2) {
											if (this.validate()) {
												this['on' + triggerIndex
														+ 'Click']();
											}
										} else {
											this['on' + triggerIndex + 'Click']();
										}
									}, this, {
										preventDefault : true
									});
							t.addClassOnOver('x-form-trigger-over');
							t.addClassOnClick('x-form-trigger-click');
						}, this);
				this.triggers = ts.elements;
			},

			onTrigger1Click : function() {
				if (this.hasSearch) {
					this.el.dom.value = '';
					var o = {
						start : 0
					};
					this.store.baseParams = this.store.baseParams || {};
					this.store.baseParams[this.paramName] = '';
					this.store.reload({
								params : o
							});
					this.triggers[0].hide();
					this.hasSearch = false;
				}
			},

			onTrigger2Click : function() {
				var v = this.getRawValue();
				if (v.length < 1) {
					this.onTrigger1Click();
					return;
				}
				var o = {
					start : 0
				};
				this.store.baseParams = this.store.baseParams || {};
				this.store.baseParams[this.paramName] = v;
				this.store.reload({
							params : o
						});
				this.hasSearch = true;
				this.triggers[0].show();
			}
		});

/**
 * @author wuxiaoxu
 * @addDate 20090826
 * @return TabPanel的扩展事件，右键菜单
 */
Ext.ux.TabCloseMenu = function() {
	var tabs, menu, ctxItem;
	this.init = function(tp) {
		tabs = tp;
		tabs.on('contextmenu', onContextMenu);
	}

	function onContextMenu(ts, item, e) {
		if (!menu) { // create context menu on first right click
			menu = new Ext.menu.Menu([{
						id : tabs.id + '-close',
						text : '关闭标签',
						handler : function() {
							tabs.remove(ctxItem);
						}
					}, {
						id : tabs.id + '-close-others',
						text : '关闭其他标签',
						handler : function() {
							tabs.items.each(function(item) {
										if (item.closable && item != ctxItem) {
											tabs.remove(item);
										}
									});
						}
					}, {
						id : tabs.id + '-close-all',
						text : '关闭全部标签',
						handler : function() {
							tabs.items.each(function(item) {
										if (item.closable) {
											tabs.remove(item);
										}
									});
						}
					}]);
		}
		ctxItem = item;
		var items = menu.items;
		items.get(tabs.id + '-close').setDisabled(!item.closable);
		var disableOthers = true;
		tabs.items.each(function() {
					if (this != item && this.closable) {
						disableOthers = false;
						return false;
					}
				});
		items.get(tabs.id + '-close-others').setDisabled(disableOthers);
		var disableAll = true;
		tabs.items.each(function() {
					if (this.closable) {
						disableAll = false;
						return false;
					}
				});
		items.get(tabs.id + '-close-all').setDisabled(disableAll);
		menu.showAt(e.getPoint());
	}
};

// wuxiaoxu add 20090901 Ext.tree复选框的通用操作

// 判断是否有子结点被选中
var childHasChecked = function(node) {
	var childNodes = node.childNodes;
	if (childNodes || childNodes.length > 0) {
		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i].getUI().checkbox.checked)
				return true;
		}
	}
	return false;
}

// 级联选中父节点
var parentCheck = function(node, checked) {
	var checkbox = node.getUI().checkbox;
	if (typeof checkbox == 'undefined')
		return false;
	if (!(checked ^ checkbox.checked))
		return false;
	if (!checked && childHasChecked(node))
		return false;
	checkbox.checked = checked;
	node.attributes.checked = checked;
	node.getUI().checkbox.indeterminate = checked; // 半选中状态
	node.getOwnerTree().fireEvent('check', node, checked);
	var parentNode = node.parentNode;
	if (parentNode !== null) {
		parentCheck(parentNode, checked);
	}
}
// wuxiaoxu add 设置树节点图片方法
Ext.override(Ext.tree.TreeNodeUI, {
	setIconCls : function(iconCls) {
		if (this.iconNode) {
			Ext.fly(this.iconNode).replaceClass(this.node.attributes.iconCls,
					iconCls);
		}
		this.node.attributes.iconCls = iconCls;
	},
	setIcon : function(icon) {
		if (this.iconNode) {
			this.iconNode.src = icon || this.emptyIcon;
			Ext.fly(this.iconNode)[icon ? 'addClass' : 'removeClass']('x-tree-node-inline-icon');
		}
		this.node.attributes.icon = icon;
	}
});
/**
 * chenqi 175 20100221 shilongfei 20101124 文件上传'退格'键监听修改，优化代码
 */
Ext.getDoc().on('keydown', function(event) {
	event = (document.all) ? window.event : event;
	var eventCode = (document.all) ? event.keyCode : event.which;
	var srcElement = (document.all) ? event.srcElement : event.target;
	var srcType = srcElement.type;
	if (eventCode == 8) {
		if (srcType == "file") {
			event.returnValue = false;
			return false;
		}
		if ((srcType == "text" || srcType == "textarea" || srcType == "password")
				&& !srcElement.readOnly) {
			return true;
		}
		event.keyCode = 0;
		event.returnValue = false;
	}
});

/**
 * wuxiaoxu 20100323 检索结果的grid
 * 
 * @param config
 *            需要对此grid的扩展属性 Object
 * @param params
 *            store的url参数 Object
 * @param url
 *            store的url String
 * @param root
 *            store的root String
 * @param totalProperty
 *            store的totalProperty String
 */

FeedGrid = function(config, params, url, root, totalProperty, currPage) {
	Ext.apply(this, config);
	// shilongfei 20101224 变量赋值 add
	isShowCheckbox = config.isShowCheckbox;
	checkboxName = config.checkboxName;
	// shilongfei 20101224 end
	// wuxiaoxu update 将store改为外面可传的 20100414
	this.store = config.store ? config.store : new Ext.data.Store({
				baseParams : params,
				proxy : new Ext.data.HttpProxy({
							url : url,
							timeout : 300000
						}),
				reader : new Ext.data.JsonReader({
							root : root,
							totalProperty : totalProperty,
							currPage : currPage
						}, [{
									name : 'title',
									mapping : 0
								}, {
									name : 'content',
									mapping : 1
								}, {
									name : 'path',
									mapping : 2
								}, {
									name : 'chk',
									mapping : 3
								}])
			});

	// this.minWidth=300;
	this.columns = [{
				id : 'title',
				header : "Title",
				dataIndex : 'title',
				sortable : true,
				width : 300,
				renderer : this.formatTitle
			}, {
				header : "path",
				dataIndex : 'path',
				width : 100,
				hidden : true,
				sortable : true
			}, {
				id : 'chk',
				header : "chk",
				dataIndex : 'chk',
				// renderer: this.formatCheckButton,
				width : 180,
				sortable : true
			}];
	// wuxiaoxu update 将bbar改为外面可传的 20100414
	this.bbar = config.bbar ? config.bbar : new Ext.PagingToolbarEx({
				withComBox : true,// tangshuang 20100507 add
				displayInfo : false,
				store : this.store,
				pageSize : 20
			});

	FeedGrid.superclass.constructor.call(this, {
				// wuxiaoxu update 将id改为外面可传的 20100414
				id : config.id ? config.id : 'topic-grid',
				// wuxiaoxu update 将region改为外面可传的 20100414
				region : config.region ? config.region : 'center',
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				autoScroll : true,
				// //lizengcun 20110429 添加最小值
				minWidth : 300,
				viewConfig : {
					forceFit : true,
					enableRowBody : true,
					showPreview : true,
					getRowClass : this.applyRowClass
				}

			});

	// this.on('rowcontextmenu', this.onContextClick, this);
};

Ext.extend(FeedGrid, Ext.grid.GridPanel, {
			onContextHide : function() {
				if (this.ctxRow) {
					Ext.fly(this.ctxRow).removeClass('x-node-ctx');
					this.ctxRow = null;
				}
			},

			loadFeed : function(params) {
				this.store.load({
							params : params
						});

			},
			reLoadFeed : function(params) {
				this.store.reload({
							params : params
						});

			},
			togglePreview : function(show) {
				this.view.showPreview = show;
				this.view.refresh();
			},

			// within this function "this" is actually the GridView
			applyRowClass : function(record, rowIndex, p, ds) {
				if (this.showPreview) {
					var xf = Ext.util.Format;
					p.body = '<br>'
							// + xf.ellipsis(xf.stripTags(record.data.content),
							// 200)
							// + xf.stripTags(record.data.content)
							+ record.data.content + '</br></br>';
					return 'x-grid3-row-expanded';
				}
				return 'x-grid3-row-collapsed';
			},

			formatDate : function(date) {
				if (!date) {
					return '';
				}
				var now = new Date();
				var d = now.clearTime(true);
				var notime = date.clearTime(true).getTime();
				if (notime == d.getTime()) {
					return 'Today ' + date.dateFormat('g:i a');
				}
				d = d.add('d', -6);
				if (d.getTime() <= notime) {
					return date.dateFormat('D g:i a');
				}
				return date.dateFormat('n/j g:i a');
			},

			formatTitle : function(value, p, record) {
				// shilongfei 20101224 更改为支持checkbox add
				// return String.format('<div class="topic"><b>{0}</b>', value,
				// record.data.content, record.id, record.data.forumid);
				if (!isShowCheckbox) {
					return String.format('<div class="topic"><b>{0}</b>',
							value, record.data.content, record.id,
							record.data.forumid);
				} else {
					return String
							.format('<div><b><input type="checkbox" name='
											+ checkboxName + ' value='
											+ record.data.path + ' />{0}</b>',
									value, record.data.content, record.id,
									record.data.forumid);
				}
				// shilongfei 20101224 end
			}
		});

// houyu add 20100406 工作流添加数据附件共用组件

var FileRead_key = new Ext.grid.CheckColumn({
			id : 'FileRead_key',
			header : '文件浏览',
			dataIndex : 'FileRead',
			width : 60
		});
var FileDownLoad_key = new Ext.grid.CheckColumn({
			id : 'FileDownLoad_key',
			header : '文件下载',
			dataIndex : 'FileDownLoad',
			width : 60
		});
// xiaoxiong 20100806 add
var FileLend_key = new Ext.grid.CheckColumn({
			id : 'FileLend_key',
			header : '实体借阅',
			dataIndex : 'FileLend',
			width : 60
		});
// end

// houyu add 20100408 去掉后两个权限
// var ArchiveBrowse_key = new Ext.grid.CheckColumn({
// id:'ArchiveBrowse_key',
// header: '档案馆查阅',
// dataIndex: 'ArchiveBrowse',
// width: 70
// });
// var ArchiveBorrow_key = new Ext.grid.CheckColumn({
// id:'ArchiveBorrow_key',
// header: '档案馆借阅',
// dataIndex: 'ArchiveBorrow',
// width: 70
// });

var FileRead = new Ext.grid.CheckColumn({
			id : 'FileRead',
			header : '文件浏览',
			dataIndex : 'FileRead',
			width : 60
		});
var FileDownLoad = new Ext.grid.CheckColumn({
			id : 'FileDownLoad',
			header : '文件下载',
			dataIndex : 'FileDownLoad',
			width : 60
		});
// xiaoxiong 20100806 add
var FileLend = new Ext.grid.CheckColumn({
			id : 'FileLend',
			header : '实体借阅',
			dataIndex : 'FileLend',
			width : 60
		});
// end

// houyu add 20100408 去掉后两个权限
// var ArchiveBrowse = new Ext.grid.CheckColumn({
// id:'ArchiveBrowse',
// header: '档案馆查阅',
// dataIndex: 'ArchiveBrowse',
// width: 70
// });
// var ArchiveBorrow = new Ext.grid.CheckColumn({
// id:'ArchiveBorrow',
// header: '档案馆借阅',
// dataIndex: 'ArchiveBorrow',
// width: 70
// });
/**
 * @author wuxiaoxu
 * @addDate 20100407
 * @return TabPanel的扩展事件，增加帮助按钮
 */
Ext.ux.AddTabButton = function() {
	function onTabPanelRender() {
		this.addTab = this.itemTpl.insertBefore(this.edge, {
					id : this.id + '_onLineHelp',
					cls : 'add-tab',
					text : '&#160',
					iconCls : ''
				}, true);
		this.addTab.child('em.x-tab-left').setStyle('padding-right', '6px');
		this.addTab.child('a.x-tab-right').setStyle('padding-left', '6px');
		new Ext.ToolTip({
					target : this.addTab,
					bodyCfg : {
						html : '\u5e2e\u52a9'
					}
				});
		this.addTab.on({
					mousedown : stopEvent,
					click : onShowOnlineHelp,
					scope : this
				});
	}

	function createScrollers() {
		this.scrollerWidth = (this.scrollRightWidth = this.scrollRight
				.getWidth())
				+ this.scrollLeft.getWidth();
	}

	function autoScrollTabs() {
		var scrollersVisible = (this.scrollLeft && this.scrollLeft.isVisible()), pos = this.tabPosition == 'top'
				? 'header'
				: 'footer';
		if (scrollersVisible) {
			if (this.addTab.dom.parentNode === this.strip.dom) {
				if (this.addTabWrap) {
					this.addTabWrap.show();
				} else {
					this.addTabWrap = this[pos].createChild({
						cls : 'x-tab-strip-wrap',
						style : {
							position : 'absolute',
							right : (this.scrollRightWidth + 1) + 'px',
							top : 0,
							width : '30px',
							margin : 0
						},
						cn : {
							tag : 'ul',
							cls : 'x-tab-strip x-tab-strip-' + this.tabPosition,
							style : {
								width : 'auto'
							}
						}
					});
					this.addTabWrap.setVisibilityMode(Ext.Element.DISPLAY);
					this.addTabUl = this.addTabWrap.child('ul');
				}
				this.addTabUl.dom.appendChild(this.addTab.dom);
				this.addTab.setStyle('float', 'none');
			}
			this.stripWrap.setWidth(this[pos].getWidth(true)
					- (this.scrollerWidth + 31));
			this.stripWrap.setStyle('margin-right',
					(this.scrollRightWidth + 31) + 'px');
		} else {
			if ((this.addTab.dom.parentNode !== this.strip.dom)) {
				var notEnoughSpace = (((this[pos].getWidth(true) - this.edge
						.getOffsetsTo(this.stripWrap)[0])) < 33);
				this.addTabWrap.hide();
				this.addTab.setStyle('float', '');
				this.strip.dom.insertBefore(this.addTab.dom, this.edge.dom);
				this.stripWrap.setWidth(this.stripWrap.getWidth() + 31);
				if (notEnoughSpace) {
					this.autoScrollTabs();
				}
			}
		}
	}

	function autoSizeTabs() {
		this.addTab.child('.x-tab-strip-inner').setStyle('width', '14px');
	}

	function stopEvent(e) {
		e.stopEvent();
	}

	function onShowOnlineHelp() {
		this.fireEvent('help', this);
	}

	return {
		init : function(tp) {
			if (tp instanceof Ext.TabPanel) {
				tp.onRender = tp.onRender.createSequence(onTabPanelRender);
				tp.createScrollers = tp.createScrollers
						.createSequence(createScrollers);
				tp.autoScrollTabs = tp.autoScrollTabs
						.createSequence(autoScrollTabs);
				tp.autoSizeTabs = tp.autoSizeTabs.createSequence(autoSizeTabs);
			}
		}
	};
};
/**
 * @author jiangyuntao
 * @addDate 20100414 增加验证特殊字符公共方法，包含特殊字符返回true，否则返回false.
 */
function ifErrChar(str) {
	var re = /[^\u4E00-\u9FA5\w]/g;
	if (re.test(str))
		return true;// yes, it contains special charactor
	return false; // no ' & ...
}
/**
 * ninglong20100428 重写时间控件，只有选择年月的界面
 * 
 * @class Ext.ux.MonthPicker
 * @extends Ext.Component
 */
Ext.ux.MonthPicker = Ext.extend(Ext.Component, {
	format : "M-y",
	okText : Ext.DatePicker.prototype.okText,
	cancelText : Ext.DatePicker.prototype.cancelText,
	constrainToViewport : true,
	monthNames : Date.monthNames,
	startDay : 0,
	value : 0,
	noPastYears : false,
	initComponent : function() {
		Ext.ux.MonthPicker.superclass.initComponent.call(this);
		this.value = this.value ? this.value.clearTime() : new Date()
				.clearTime();
		this.addEvents('select');
		if (this.handler) {
			this.on("select", this.handler, this.scope || this);
		}
	},
	focus : function() {
		if (this.el) {
			this.update(this.activeDate);
		}
	},
	onRender : function(container, position) {
		var m = ['<div style="width: 200px; height:175px;"></div>']
		m[m.length] = '<div class="x-date-mp"></div>';
		var el = document.createElement("div");
		el.className = "x-date-picker";
		el.innerHTML = m.join("");
		container.dom.insertBefore(el, position);
		this.el = Ext.get(el);
		this.monthPicker = this.el.down('div.x-date-mp');
		this.monthPicker.enableDisplayMode('block');
		this.el.unselectable();
		this.showMonthPicker();
		if (Ext.isIE) {
			this.el.repaint();
		}
		this.update(this.value);
	},
	createMonthPicker : function() {
		if (!this.monthPicker.dom.firstChild) {
			var buf = ['<table border="0" cellspacing="0">'];
			for (var i = 0; i < 6; i++) {
				buf
						.push(
								'<tr><td class="x-date-mp-month"><a href="#">',
								this.monthNames[i].substr(0, 3),
								'</a></td>',
								'<td class="x-date-mp-month x-date-mp-sep"><a href="#">',
								this.monthNames[i + 6].substr(0, 3),
								'</a></td>',
								i == 0
										? '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>'
										: '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>');
			}
			buf
					.push(
							'<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
							this.okText,
							'</button><button type="button" class="x-date-mp-cancel">',
							this.cancelText, '</button></td></tr>', '</table>');
			this.monthPicker.update(buf.join(''));
			this.monthPicker.on('click', this.onMonthClick, this);
			this.monthPicker.on('dblclick', this.onMonthDblClick, this);
			this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
			this.mpYears = this.monthPicker.select('td.x-date-mp-year');
			this.mpMonths.each(function(m, a, i) {
						i += 1;
						if ((i % 2) == 0) {
							m.dom.xmonth = 5 + Math.round(i * .5);
						} else {
							m.dom.xmonth = Math.round((i - 1) * .5);
						}
					});
		}
	},
	showMonthPicker : function() {
		this.createMonthPicker();
		var size = this.el.getSize();
		this.monthPicker.setSize(size);
		this.monthPicker.child('table').setSize(size);
		this.mpSelMonth = (this.activeDate || this.value).getMonth();
		this.updateMPMonth(this.mpSelMonth);
		this.mpSelYear = (this.activeDate || this.value).getFullYear();
		this.updateMPYear(this.mpSelYear);
		this.monthPicker.show();
		// this.monthPicker.slideIn('t', {duration:.2});
	},
	updateMPYear : function(y) {
		if (this.noPastYears) {
			var minYear = new Date().getFullYear();
			if (y < (minYear + 4)) {
				y = minYear + 4;
			}
		}
		this.mpyear = y;
		var ys = this.mpYears.elements;
		for (var i = 1; i <= 10; i++) {
			var td = ys[i - 1], y2;
			if ((i % 2) == 0) {
				y2 = y + Math.round(i * .5);
				td.firstChild.innerHTML = y2;
				td.xyear = y2;
			} else {
				y2 = y - (5 - Math.round(i * .5));
				td.firstChild.innerHTML = y2;
				td.xyear = y2;
			}
			this.mpYears.item(i - 1)[y2 == this.mpSelYear
					? 'addClass'
					: 'removeClass']('x-date-mp-sel');
		}
	},
	updateMPMonth : function(sm) {
		this.mpMonths.each(function(m, a, i) {
			m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
		});
	},
	selectMPMonth : function(m) {
	},
	onMonthClick : function(e, t) {
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if (el.is('button.x-date-mp-cancel')) {
			this.hideMonthPicker();
			// this.fireEvent("select", this, this.value);
		} else if (el.is('button.x-date-mp-ok')) {
			this.update(new Date(this.mpSelYear, this.mpSelMonth,
					(this.activeDate || this.value).getDate()));
			// this.hideMonthPicker();
			this.fireEvent("select", this, this.value);
		} else if (pn = el.up('td.x-date-mp-month', 2)) {
			this.mpMonths.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelMonth = pn.dom.xmonth;
		} else if (pn = el.up('td.x-date-mp-year', 2)) {
			this.mpYears.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelYear = pn.dom.xyear;
		} else if (el.is('a.x-date-mp-prev')) {
			this.updateMPYear(this.mpyear - 10);
		} else if (el.is('a.x-date-mp-next')) {
			this.updateMPYear(this.mpyear + 10);
		}
	},
	onMonthDblClick : function(e, t) {
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if (pn = el.up('td.x-date-mp-month', 2)) {
			this.update(new Date(this.mpSelYear, pn.dom.xmonth,
					(this.activeDate || this.value).getDate()));
			// this.hideMonthPicker();
			this.fireEvent("select", this, this.value);
		} else if (pn = el.up('td.x-date-mp-year', 2)) {
			this.update(new Date(pn.dom.xyear, this.mpSelMonth,
					(this.activeDate || this.value).getDate()));
			// this.hideMonthPicker();
			this.fireEvent("select", this, this.value);
		}
	},
	hideMonthPicker : function(disableAnim) {
		Ext.menu.MenuMgr.hideAll();
	},
	showPrevMonth : function(e) {
		this.update(this.activeDate.add("mo", -1));
	},
	showNextMonth : function(e) {
		this.update(this.activeDate.add("mo", 1));
	},
	showPrevYear : function() {
		this.update(this.activeDate.add("y", -1));
	},
	showNextYear : function() {
		this.update(this.activeDate.add("y", 1));
	},
	update : function(date) {
		this.activeDate = date;
		this.value = date;
		if (!this.internalRender) {
			var main = this.el.dom.firstChild;
			var w = main.offsetWidth;
			this.el.setWidth(w + this.el.getBorderWidth("lr"));
			Ext.fly(main).setWidth(w);
			this.internalRender = true;
			if (Ext.isOpera && !this.secondPass) {
				main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth))
						+ "px";
				this.secondPass = true;
				this.update.defer(10, this, [date]);
			}
		}
	}
});
Ext.reg('monthpicker', Ext.ux.MonthPicker);

Ext.ux.MonthItem = function(config) {
	Ext.ux.MonthItem.superclass.constructor.call(this,
			new Ext.ux.MonthPicker(config), config);
	this.picker = this.component;
	this.addEvents('select');
	this.picker.on("render", function(picker) {
				picker.getEl().swallowEvent("click");
				picker.container.addClass("x-menu-date-item");
			});
	this.picker.on("select", this.onSelect, this);
};
Ext.extend(Ext.ux.MonthItem, Ext.menu.Adapter, {
			onSelect : function(picker, date) {
				this.fireEvent("select", this, date, picker);
				Ext.ux.MonthItem.superclass.handleClick.call(this);
			}
		});
Ext.ux.MonthMenu = function(config) {
	Ext.ux.MonthMenu.superclass.constructor.call(this, config);
	this.plain = true;
	var mi = new Ext.ux.MonthItem(config);
	this.add(mi);
	this.picker = mi.picker;
	this.relayEvents(mi, ["select"]);
};
Ext.extend(Ext.ux.MonthMenu, Ext.menu.Menu, {
			cls : 'x-date-menu'
		});
Ext.ux.MonthField = function(cfg) {
	Ext.ux.MonthField.superclass.constructor.call(this, Ext
					.apply({}, cfg || {}));
}
Ext.extend(Ext.ux.MonthField, Ext.form.DateField, {
			format : "Y-m",
			triggerClass : "x-form-date-trigger",
			menuListeners : {
				select : function(m, d) {
					this.setValue(d.format(this.format));
				},
				show : function() {
					this.onFocus();
				},
				hide : function() {
					this.focus.defer(10, this);
					var ml = this.menuListeners;
					this.menu.un("select", ml.select, this);
					this.menu.un("show", ml.show, this);
					this.menu.un("hide", ml.hide, this);
				}
			},
			onTriggerClick : function() {
				if (this.disabled) {
					return;
				}
				if (this.menu == null) {
					this.menu = new Ext.ux.MonthMenu();
				}
				Ext.apply(this.menu.picker, {});
				this.menu.on(Ext.apply({}, this.menuListeners, {
							scope : this
						}));
				this.menu.show(this.el, "tl-bl?");
			}
		});
Ext.reg("monthfield", Ext.ux.MonthField);
// add wangfei 20101026 修改ext中拖拽和CheckboxSelectionModel冲突的问题
Ext.grid.RowSelectionModel.override({
			// FIX: added this function so it could be overrided in
			// CheckboxSelectionModel
			handleDDRowClick : function(grid, rowIndex, e) {
				if (e.button === 0 && !e.shiftKey && !e.ctrlKey) {
					this.selectRow(rowIndex, false);
					grid.view.focusRow(rowIndex);
				}
			},

			initEvents : function() {
				if (!this.grid.enableDragDrop && !this.grid.enableDrag) {
					this.grid.on("rowmousedown", this.handleMouseDown, this);
				} else { // allow click to work like normal
					// FIX: made this handler function overrideable
					this.grid.on("rowclick", this.handleDDRowClick, this);
				}

				this.rowNav = new Ext.KeyNav(this.grid.getGridEl(), {
							"up" : function(e) {
								if (!e.shiftKey) {
									this.selectPrevious(e.shiftKey);
								} else if (this.last !== false
										&& this.lastActive !== false) {
									var last = this.last;
									this.selectRange(this.last, this.lastActive
													- 1);
									this.grid.getView()
											.focusRow(this.lastActive);
									if (last !== false) {
										this.last = last;
									}
								} else {
									this.selectFirstRow();
								}
							},
							"down" : function(e) {
								if (!e.shiftKey) {
									this.selectNext(e.shiftKey);
								} else if (this.last !== false
										&& this.lastActive !== false) {
									var last = this.last;
									this.selectRange(this.last, this.lastActive
													+ 1);
									this.grid.getView()
											.focusRow(this.lastActive);
									if (last !== false) {
										this.last = last;
									}
								} else {
									this.selectFirstRow();
								}
							},
							scope : this
						});

				var view = this.grid.view;
				view.on("refresh", this.onRefresh, this);
				view.on("rowupdated", this.onRowUpdated, this);
				view.on("rowremoved", this.onRemove, this);
			}
		});

Ext.grid.CheckboxSelectionModel.override({
			// FIX: added this function to check if the click occured on the
			// checkbox.
			// If so, then this handler should do nothing...
			handleDDRowClick : function(grid, rowIndex, e) {
				var t = Ext.lib.Event.getTarget(e);
				if (t.className != "x-grid3-row-checker") {
					Ext.grid.CheckboxSelectionModel.superclass.handleDDRowClick
							.apply(this, arguments);
				}
			}
		});

Ext.grid.GridDragZone.override({
			getDragData : function(e) {
				var t = Ext.lib.Event.getTarget(e);
				var rowIndex = this.view.findRowIndex(t);
				if (rowIndex !== false) {
					var sm = this.grid.selModel;
					// FIX: Added additional check (t.className !=
					// "x-grid3-row-checker"). It may not
					// be beautiful solution but it solves my problem at the
					// moment.
					if ((t.className != "x-grid3-row-checker")
							&& (!sm.isSelected(rowIndex) || e.hasModifier())) {
						sm.handleMouseDown(this.grid, rowIndex, e);
					}
					return {
						grid : this.grid,
						ddel : this.ddel,
						rowIndex : rowIndex,
						selections : sm.getSelections()
					};
				}

				return false;
			}
		});
// end wangfei 20101026

Ext.namespace('Ext.PagingToolbarEx');

Ext.PagingToolbarEx = Ext.extend(Ext.PagingToolbar, {
	space : '&nbsp;',
	beforePageText : '',
	afterPageText : '',
	randomId : 0,
	allPageSize : -1,
	searchKeyword : '',
	formArrays : function(arys, cur_page) {

		for (var i = 0; i < arys.length; i++) {
			var page_dom = null;
			if (!Ext.get('page_dom_' + this.randomId + '_' + i)) {
				page_dom = Ext.get(this.addDom({
							tag : 'span',
							type : 'text',
							id : 'page_dom_' + this.randomId + '_' + i,
							html : this.space + arys[i] + this.space
						}).el);
			} else {
				page_dom = Ext.get('page_dom_' + this.randomId + '_' + i);
			}

			if (page_dom) {
				page_dom.dom.innerHTML = (arys[i] == '') ? '' : (this.space
						+ arys[i] + this.space);
				if (arys[i] != '' && arys[i] != '...' && arys[i] != cur_page) {
					page_dom.dom.style.cursor = 'pointer';
					page_dom.dom.style.color = '#6294E5';
					// page_dom.dom.style.fontWeight = 'bold';
				}
				if (arys[i] === cur_page) {
					page_dom.dom.style.cursor = '';
					page_dom.dom.style.color = '#000000';
				}
				page_dom.removeAllListeners();
				if (arys[i] == '...' || arys[i] == '' || arys[i] == cur_page) {
					page_dom.on('click', function() {
							});
				} else if (typeof(arys[i]) == 'number') {
					page_dom.on('click', function(e, k) {
								var cur_page = parseInt(k.textContent
										|| k.innerText);
								var total = this.store.getTotalCount();
								var pages = Math.ceil(total / this.pageSize);
								this.doLoad((cur_page - 1) * this.pageSize);
							}, this);
				}
			}
		}
	},
	reloadPages : function() {
		this.allPageSize = -1;
	},
	formPage : function() {

		// this.cursor 0,1,2...
		// var cur_page = Math.ceil((this.cursor+this.pageSize)/this.pageSize)
		// 1,2,3...
		// this.cursor+1, this.cursor+count, this.store.getTotalCount() 11-20 of
		// 45
		// var pages = Math.ceil(this.store.getTotalCount()/this.pageSize) total
		// 45 pages
		var thisCurrPage = this.store.getThisCurrPage();
		var cur_page = Math.ceil((this.cursor + this.pageSize) / this.pageSize);
		if (thisCurrPage > 0 && thisCurrPage < cur_page) {
			this.allPageSize = thisCurrPage;
			cur_page = thisCurrPage;
			this.next.setDisabled(true);
		}
		var total = this.store.getTotalCount();
		var pages = Math.ceil(total / this.pageSize);
		var arrays = [];
		if (pages <= 10) {
			for (var i = 0; i < 11; i++) {
				if (this.allPageSize > 0) {
					if (i < this.allPageSize)
						arrays.push(i + 1);
					else
						arrays.push('');
				} else {
					if (i < pages)
						arrays.push(i + 1);
					else
						arrays.push('');
				}
			}
		} else {
			if (cur_page <= 6) {
				for (var i = 0; i < 11; i++) {
					if (this.allPageSize > 0) {
						if (i < this.allPageSize)
							arrays.push(i + 1);
						else
							arrays.push('');
					} else {
						if (i <= 8)
							arrays.push(i + 1);
						else if (i == 9)
							arrays.push('...');
					}
					// else if(i==10) arrays.push(pages);
				}
			} else if (cur_page > 6 && cur_page < (pages - 5)) {
				for (var i = 0; i < 11; i++) {
					if (this.allPageSize > 0) {
						if (i < this.allPageSize)
							arrays.push(i + 1);
						else
							arrays.push('');
					} else {
						if (i == 0)
							arrays.push(i + 1);
						else if (i == 1 || i == 9)
							arrays.push('...');
						else if (i > 1 && i < 9)
							arrays.push(cur_page - (5 - i));
					}
					// else if(i==10) arrays.push(pages);
				}
			} else if (cur_page >= (pages - 5)) {
				for (var i = 0; i < 11; i++) {
					if (this.allPageSize > 0) {
						if (i < this.allPageSize)
							arrays.push(i + 1);
						else
							arrays.push('');
					} else {
						if (i == 0)
							arrays.push(i + 1);
						else if (i == 1)
							arrays.push('...');
					}
					// else arrays.push(pages-(10-i));
				}
			}
		}

		this.formArrays(arrays, cur_page);
	},

	// private
	onRender : function(ct, position) {
		this.randomId = Math.random();
		Ext.PagingToolbar.superclass.onRender.call(this, ct, position);
		this.first = this.addButton({
					tooltip : this.firstText,
					// iconCls: "x-tbar-page-first",
					hide : true,
					text : '',
					disabled : true,
					handler : this.onClick.createDelegate(this, ["first"])
				});
		this.prev = this.addButton({
					tooltip : this.prevText,
					// iconCls: "x-tbar-page-prev",
					text : '<span style="color:#6294E5"><< 前一页</span>',
					disabled : true,
					handler : this.onClick.createDelegate(this, ["prev"])
				});
		this.addSeparator();
		this.add(this.beforePageText);

		this.field = Ext.get(this.addDom({
					// tag: "input",
					// type: "text",
					// size: "3",
					// value: "1",
					// cls: "x-tbar-page-number"
					tag : "span",
					type : "text",
					html : ''
				}).el);

		for (var i = 0; i < 11; i++) {
			this.addDom({
						tag : 'span',
						type : 'text',
						id : 'page_dom_' + this.randomId + '_' + i,
						html : ''
					})
		}

		this.field.on("keydown", this.onPagingKeydown, this);
		this.field.on("focus", function() {
					this.dom.select();
				});
		this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
		this.field.setHeight(18);
		this.addSeparator();
		this.next = this.addButton({
					tooltip : this.nextText,
					// iconCls: "x-tbar-page-next",
					text : '<span style="color:#6294E5">后一页 >></span>',
					style : 'color:#77AAFF',
					disabled : true,
					handler : this.onClick.createDelegate(this, ["next"])
				});
		this.last = this.addButton({
					tooltip : this.lastText,
					// iconCls: "x-tbar-page-last",
					hide : true,
					text : '',
					disabled : true,
					handler : this.onClick.createDelegate(this, ["last"])
				});
		this.addSeparator();
		this.loading = this.addButton({
					tooltip : this.refreshText,
					iconCls : "x-tbar-loading",
					handler : this.onClick.createDelegate(this, ["refresh"])
				});

		if (this.displayInfo) {
			this.displayEl = Ext.fly(this.el.dom).createChild({
						cls : 'x-paging-info'
					});
		}
		if (this.dsLoaded) {
			this.onLoad.apply(this, this.dsLoaded);
		}
	},
	onClick : function(which) {
		var store = this.store;
		switch (which) {
			case "first" :
				this.doLoad(0);
				break;
			case "prev" :
				var thisCurrPage = this.store.getThisCurrPage();
				if (thisCurrPage > 0) {
					this.doLoad(Math.max(0, (thisCurrPage - 1) * this.pageSize
									- this.pageSize));
				} else {
					this.doLoad(Math.max(0, this.cursor - this.pageSize));
				}
				break;
			case "next" :
				this.doLoad(this.cursor + this.pageSize);
				break;
			case "last" :
				var total = store.getTotalCount();
				var extra = total % this.pageSize;
				var lastStart = extra ? (total - extra) : total - this.pageSize;
				this.doLoad(lastStart);
				break;
			case "refresh" :
				this.doLoad(this.cursor);
				break;
		}
	},
	// private
	onLoad : function(store, r, o) {
		if (!this.rendered) {
			this.dsLoaded = [store, r, o];
			return;
		}
		if (this.searchKeyword != o.params.searchKeyword) {
			this.searchKeyword = o.params.searchKeyword;
			this.reloadPages();
		}
		this.cursor = o.params ? o.params[this.paramNames.start] : 0;
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;

		this.afterTextEl.el.innerHTML = String.format(this.afterPageText,
				d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled((ap == 1) || (ap == 0));// wuxiaoxu 20110426 set
														// this.prev.disabled =
														// true when ap = 0
		// this.prev.setDisabled(ap == 1);
		this.next.setDisabled((ap == ps) || (ap == this.allPageSize));
		this.last.setDisabled(ap == ps);
		this.loading.enable();
		this.updateInfo();
		this.formPage();
	}
});

Ext.reg('pagingtoolbarex', Ext.PagingToolbarEx);

// wuxiaoxu 20101210 add showRelevance cookie operator
function getShowRelevance() {
	var ck = new Ext.state.CookieProvider();
	if (ck.get('showRelevance')) {
		return true;
	} else {
		return false;
	}
}

function setShowRelevance(checked) {
	var ck = new Ext.state.CookieProvider();
	ck.set('showRelevance', checked);
}

// wuxiaoxu 20101210 add showRelevance cookie operator end

// luowenfei 20110107 add start
Ext.data.PagingMemoryProxy = function(data) {
	Ext.data.PagingMemoryProxy.superclass.constructor.call(this);
	this.data = data;
};

Ext.extend(Ext.data.PagingMemoryProxy, Ext.data.MemoryProxy, {
			load : function(params, reader, callback, scope, arg) {
				params = params || {};
				var result;
				try {
					result = reader.readRecords(this.data);
				} catch (e) {
					this.fireEvent("loadexception", this, arg, null, e);
					callback.call(scope, null, arg, false);
					return;
				}

				// filtering
				if (params.filter !== undefined) {
					result.records = result.records.filter(function(el) {
								if (typeof(el) == "object") {
									var att = params.filterCol || 0;
									return String(el.data[att])
											.match(params.filter)
											? true
											: false;
								} else {
									return String(el).match(params.filter)
											? true
											: false;
								}
							});
					result.totalRecords = result.records.length;
				}

				// sorting
				if (params.sort !== undefined) {
					// use integer as params.sort to specify column, since
					// arrays are not named
					// params.sort=0; would also match a array without columns
					var dir = String(params.dir).toUpperCase() == "DESC"
							? -1
							: 1;
					var fn = function(r1, r2) {
						return r1 < r2;
					};
					result.records.sort(function(a, b) {
								var v = 0;
								if (typeof(a) == "object") {
									v = fn(a.data[params.sort],
											b.data[params.sort])
											* dir;
								} else {
									v = fn(a, b) * dir;
								}
								if (v == 0) {
									v = (a.index < b.index ? -1 : 1);
								}
								return v;
							});
				}

				// paging (use undefined cause start can also be 0 (thus false))
				if (params.start !== undefined && params.limit !== undefined) {
					result.records = result.records.slice(params.start,
							params.start + params.limit);
				}
				// first load set start = 0 ; limit = 10
				if (params.start == undefined && params.limit == undefined) {
					// alert('start = '+params.start);
					// alert('limit = '+params.limit);
					result.records = result.records.slice(0, 10);
				}

				callback.call(scope, result, arg, true);
			}
		});

// luowenfei 20110107 end

// luowenfei 20110504 rewrite radiogroup getVaule add
Ext.override(Ext.form.RadioGroup, {
			getValue : function() {
				var v;
				this.items.each(function(item) {
							if (item.getValue()) {
								v = item.getRawValue();
								return false;
							}
						});
				return v;
			},

			setValue : function(v) {
				if (this.rendered)
					this.items.each(function(item) {
								item.setValue(item.getRawValue() == v);
							});
				else
					for (k in this.items)
						this.items[k].checked = this.items[k].inputValue == v;
			}
		});
// wuxiaoxu 20101210 add showRelevance cookie operator
function getCookie(key) {
	var ck = new Ext.state.CookieProvider();
	if (ck.get(key ? key : 'showRelevance')) {
		return true;
	} else {
		return false;
	}
}

function setCookie(checked,key) {
	var ck = new Ext.state.CookieProvider();
	ck.set(key ? key : 'showRelevance', checked);
}

// wuxiaoxu 20101210 add showRelevance cookie operator end

function showArchiveReturn(title,url,usingFormId,ufId,usingStoreId){
	createWindow(title,usingStoreId + 'archiveReturn' + usingFormId,600,800,url,{parentWinId: usingStoreId + 'archiveReturn' + usingFormId,ufId: ufId,usingFormId: usingFormId,usingStoreId: usingStoreId}) ;
}
function createWindow(title,windowId,height,width,loadUrl,params){
	if(Ext.temp && Ext.temp.ArchiveReturnWindow){
		Ext.temp.ArchiveReturnWindow.show() ;
		params.parentWinId = Ext.temp.ArchiveReturnWindow.id ;
		Ext.temp.ArchiveReturnWindow.load({url: loadUrl,params: params}) ;
		return ;
	}
	Ext.temp = {} ;
	Ext.temp.ArchiveReturnWindow = new Ext.Window({ 
			id : windowId, 
			title: title, 
   			layout: 'fit',
			width: width, 
			height: height, 
			animCollapse : true, 
			maximizable : false,
   			autoLoad:{url: loadUrl,params: params,nocache:true,scripts:true},
			autoScroll : true,
			listeners:{close:function(){Ext.temp.ArchiveReturnWindow = null ;}}
	}) ;
	Ext.temp.ArchiveReturnWindow.show() ;
}

// wuxiaoxu 20111014 此方法用于设置toolbar上按钮的禁用启用，可排除某些按钮
function setToolbarButtonDisabledOrEnabledWithout(toobar,withouts,disable){
	if(toobar){
		if(toobar.items){
			if(!withouts){
				toobar.setDisabled(disable) ;
				return ;
			}
			var enableds = withouts.split(';') ;
			toobar.items.each(function(item){
				if(undefined == item.oldDisabled){
					item.oldDisabled = item.disabled ;
				}
				if(!item.text){
					if(item['setDisabled']){
						item.setDisabled(disable) ;
					}
					return true ;
				}
				var disabled = disable ;
				Ext.each(enableds,function(enabled){
					if(enabled == item.text){
						disabled = !disable ;
						return false ;
					}
				}) ;
				if(item['setDisabled']){
					item.setDisabled(disabled) ;
				}
			}) ;
		}
	}
}
// wuxiaoxu 20111014 此方法用于还原toolbar上按钮的是否启用
function retToolbarButtonEnabled(toobar){
	if(toobar){
		if(toobar.items){
			toobar.items.each(function(item){
				if(item['setDisabled'] && undefined != item.oldDisabled){
					item.setDisabled(item.oldDisabled) ;
				}
			}) ;
		}
	}
}
/*//ninglong20111026
Ext.form.TextField.override({
	initComponent : Ext.form.TextField.prototype.initComponent
	.createInterceptor(function() {
		if (this.allowBlank === false && this.fieldLabel) {
			this.fieldLabel += '<font color=red>*</font>';
		}
	})
});*/
// wuxiaoxu 20120322 用于在案卷级查看电子文件
function childOnlineView(pkgPath){
	var businessName = pkgPath.substring(1,pkgPath.indexOf("/",1)) ;
	Ext.Ajax.request({
	    url:'businessEdit.html?businessName=' + businessName + '&content.method=childOnlineView&path=' + pkgPath,
	    callback:function(options,success,response){
             var json = Ext.util.JSON.decode(response.responseText) ;
             if(!json.success){
             	Ext.Msg.alert('消息','您没有【浏览电子文件的角色】或没有【浏览电子文件的权限】，请联系管理员！') ;
             } else {
             	onlineView(json.filePath,json.pkgPath,json.hasPrint) ;
             }
	    }
    }) ;
}
// wuxiaoxu 20120322 用于点击查看按钮查看电子文件
function onlineView(value,bistreamPath,hasPrint){
       var ftpPath,temp ; 
       if(value.substring(value.length-1,value.length) == '*'){ 
          ftpPath = value.substring(0,value.length-1);
       } else { 
         	temp = value.split(';');
         	ftpPath = temp[0];
	        if(temp.length > 1 && temp[1] == 'false'){
	        	Ext.Msg.alert('消息','您没有【浏览电子文件的角色】或没有【浏览电子文件的权限】，请联系管理员！') ;
		        return ;
		    } 
	        if(temp[0] == ''){
	        	Ext.Msg.alert('消息','没有原文路径！') ;
	        	return ;
	        } 
      } 
      if(ftpPath.indexOf('*')!=-1){ 
         var paths = ftpPath.split('*'); 
         for(var i =0 ;i<paths.length-1;i++){ 
          ftpPath = ftpPath.replace('*',';'); 
         } 
      } 
      if(ftpPath.indexOf('RTSP') >=0 ){
      		Ext.Ajax.request({
	       		url:'baseUtilAction.html?content.method=getbitstreamMediaParamter&file='+ftpPath,
	    		callback:function(options,success,response){
               		var json=Ext.util.JSON.decode(response.responseText);  
	      			window.open(json.file);
	     		}
    		}) ;
	  } else if (ftpPath.indexOf('RTMP') >= 0) {		
   			var selectedPath = bistreamPath; 								
            var suffix = ftpPath.substring(ftpPath.lastIndexOf('.')+1).toUpperCase() ;
            if(suffix != 'FLV' && suffix != 'MP3'){
            	Ext.Msg.alert('消息','流媒体不能播放此格式文件!') ;
            	return ;
            }
            
            
            
            
			new Ext.Window ({  													
           			id : 'archiveGridVideoPlayer', 					
					title : '电子文件显示',  	
   					layout : 'fit',												
   					modal : true,												
   					width : 1000,												
   					height : 700,												
   					autoScroll : true,											
	  				modal : true,												
           			maximizable : false,										
   					autoLoad : {url : 'bitstreamView.html', params:{pkgpath : selectedPath, bitstream : ftpPath,hasPrint: hasPrint}, nocache : true, scripts : true}
			}).show() ;  																
      } else {
    	var selectpath = bistreamPath; 
		new Ext.Window({  
            id: 'archiveGridBitstreamViewwindow' , 
			title:'电子文件显示',  
    		layout      : 'fit',
    		modal:true,
    		width       : 1000,
    		height      : 649,
    		autoScroll  : true,
            resizable : false,
            maximizable : false,
    		autoLoad:{url: 'bitstreamView.html',params:{pkgpath:selectpath,bitstream:ftpPath,hasPrint: hasPrint},nocache:true,scripts:true}
		}).show() ;  
     } 
} 
