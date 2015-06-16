package cn.superflying.oms.webapp.taglib.user;

import javax.servlet.jsp.JspException;


import cn.superflying.oms.webapp.taglib.BaseTag;

public class UserHomeTag extends BaseTag {

	/**
	 * @author wuxiaoxu 20111105
	 * @description 用户管理
	 */
	private static final long serialVersionUID = 1L;
	
	private static final String URL = "/user";
	
	public int doStartTag() throws JspException {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<script>\r\n");
		
		selfVtype( buffer);//添加自定义函数 
		
		deleteFunction(buffer);//删除函数
		
		addFunction(buffer);//增加处理函数
		
		funFunction(buffer);
		
		editFunction(buffer);//修改处理函数
		
		combox(buffer);//获取combox
				
		getColumn(buffer);//获取ColumnModel
		
		getData(buffer);//获取数据库表数据
		
		getGridPanel(buffer);//获取Gridpanel
		
		rowdblclick( buffer);//双击处理函数 20111107
		// 组装数据
		buffer.append("</script>").append("\r\n");
		buffer.append("<div id='UserHomeTag'/>").append("\r\n");
		this.writeBuffer(buffer);
		return EVAL_BODY_INCLUDE;
	}
	
	/**
	 * @author wuxiaoxu 20111018 删除处理函数
	 * @param buffer
	 */
	public void deleteFunction(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
//		删除函数
		buffer.append("  function del"+winid+"(){                                            		    ").append("\r\n");
		buffer.append("     var del_Conunt="+winid+"grid.getSelectionModel().getCount();                ").append("\r\n");
		buffer.append("     if(del_Conunt<1){                                                           ").append("\r\n");
		buffer.append("         Ext.Msg.alert('消息','请选择要操作的数据！');      		 	 	 	 	    ").append("\r\n");
		buffer.append("     	return ;                                                                ").append("\r\n");
		buffer.append("     }                                                     						").append("\r\n");
		buffer.append("     var del_record="+winid+"grid.getSelectionModel().getSelections();           ").append("\r\n");
		buffer.append("     var ids='';                                                        		    ").append("\r\n");
		buffer.append("     for(var i=0; i<del_record.length; i++){                                     ").append("\r\n");
		buffer.append("         ids += del_record[i].data.id + ',';                            		    ").append("\r\n");
		buffer.append("     }                                                                   		").append("\r\n");
		buffer.append("		Ext.Msg.confirm('消息','确定删除数据?',function(buttonobj){					").append("\r\n");
		buffer.append("			if(buttonobj=='yes'){													").append("\r\n");
		buffer.append("				Ext.Ajax.request({													").append("\r\n");
		buffer.append("					url:'" + URL+ "/delete',										").append("\r\n");
		buffer.append("					params : {														").append("\r\n");
		buffer.append("						ids : ids													").append("\r\n");
		buffer.append("					},																").append("\r\n");
		buffer.append("					callback:function(options,success,response){					").append("\r\n");
		buffer.append("						var json = Ext.util.JSON.decode(response.responseText);		").append("\r\n");
		buffer.append("       				if(json.success){											").append("\r\n");
		buffer.append("							Ext.Msg.alert('消息',json.msg);							").append("\r\n");
		buffer.append("							Ext.getCmp('"+winid+"grid').getStore().reload();		").append("\r\n");
		buffer.append("        				}else{														").append("\r\n");
		buffer.append("							Ext.Msg.alert('消息',json.msg);							").append("\r\n");
		buffer.append("					 	}															").append("\r\n");
		buffer.append("					}																").append("\r\n");
		buffer.append("				});																	").append("\r\n");
		buffer.append("				Ext.getCmp('"+winid+"grid').getStore().reload();					").append("\r\n");
		buffer.append("			}																		").append("\r\n");
		buffer.append("		});																			").append("\r\n"); 
		buffer.append("}                                                                     	        ").append("\r\n");
	}
	
	//自定义密码验证
	public void selfVtype(StringBuffer buffer){
		buffer.append("  Ext.apply(Ext.form.VTypes,{   													").append("\r\n");  
		buffer.append("     password:function(val,field){												").append("\r\n");
		buffer.append("     	if(field.confirmTo){													").append("\r\n");//confirmTo是id值
		buffer.append("     		var pwd=Ext.get(field.confirmTo);									").append("\r\n");
		buffer.append("     		return (val==pwd.getValue());										").append("\r\n");  
		buffer.append("     	}																		").append("\r\n");  
		buffer.append("     	return true;															").append("\r\n");  
		buffer.append("     }																			").append("\r\n");  
		buffer.append("  });   																			").append("\r\n");  
		buffer.append("     																			").append("\r\n");  
	}	
		
	/**
	 * @see 删除处理函数
	 * @author wuxiaoxu 20111018 
	 * @param buffer
	 */
	public void addFunction(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		//增加函数
		buffer.append("function add"+winid+"(){                                                         ").append("\r\n");
		buffer.append("		function sava"+winid+"data(){												").append("\r\n");
		buffer.append("   		if(!Ext.getCmp('add"+winid+"Window_panel').form.isValid()) return;		").append("\r\n");
		buffer.append("   		Ext.getCmp('add"+winid+"Window_panel').form.doAction('submit',{			").append("\r\n");
		buffer.append("         	url:'" + URL + "/save',												").append("\r\n");
		buffer.append("             method:'post',														").append("\r\n");
		buffer.append("             success:function(form,action){ 										").append("\r\n");              
		buffer.append("         		var json = Ext.util.JSON.decode(action.response.responseText);	").append("\r\n");
		buffer.append("         		if(json.success =='0'){											").append("\r\n");
		buffer.append("             		Ext.getCmp('"+winid+"grid').getStore().reload();			").append("\r\n");
		buffer.append("                	 	Ext.Msg.alert('消息',json.msg);    							").append("\r\n");
		buffer.append("						Ext.getCmp('add"+winid+"Window').destroy();					").append("\r\n");
		buffer.append("         		}else{															").append("\r\n");
		buffer.append("             		Ext.Msg.alert('消息',json.msg);								").append("\r\n");
		buffer.append("         		}																").append("\r\n");
		buffer.append("             },																	").append("\r\n");
		buffer.append("             failure:function() {												").append("\r\n");
		buffer.append("             	Ext.Msg.alert('消息','保存失败');									").append("\r\n");
		buffer.append("             }																	").append("\r\n");
		buffer.append("         })																		").append("\r\n");
		buffer.append("    }																			").append("\r\n");
		//end----保存数据处理函数
		
		buffer.append("   if(Ext.getCmp('add"+winid+"Window'))											").append("\r\n");  
		buffer.append("   	Ext.getCmp('add"+winid+"Window').destroy();									").append("\r\n");  
//		buffer.append("   var add"+winid+"Window=new Ext.Window({  										").append("\r\n");  
		buffer.append("   new Ext.Window({  															").append("\r\n");  
		buffer.append("    id:'add"+winid+"Window',														").append("\r\n");
		buffer.append("    title	:	'添加用户',														").append("\r\n");
		buffer.append("    width	:	370, 															").append("\r\n");
		buffer.append("    height	:	220, 															").append("\r\n");
		buffer.append("	   layout	:	'fit',															").append("\r\n");
		buffer.append("    plain 	:	true, 															").append("\r\n");
		buffer.append("    modal 	:	true,															").append("\r\n");
		buffer.append("    items	:  	new Ext.FormPanel({												").append("\r\n");
		buffer.append("                 	id	:	'add"+winid+"Window_panel',							").append("\r\n");
		buffer.append("                     autoDestroy:true,											").append("\r\n");
		buffer.append("                  	bodyStyle:'padding:5px 5px 0',								").append("\r\n");
//		buffer.append("                  	width: 350,													").append("\r\n"); 
		buffer.append("                    	defaults: {width: 230},										").append("\r\n");
		buffer.append("                 	defaultType: 'textfield',									").append("\r\n");
		buffer.append("                   	items: [													").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;用&nbsp;&nbsp;户&nbsp;&nbsp;名&nbsp;&nbsp;', name: 'name',vtype:'alphanum',maxLength: 20,minLength: 2,allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;',name: 'password',id: 'password',maxLength: 20,/*minLength: 5,*/allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！' ,inputType :'password'},").append("\r\n");
		buffer.append("                       		{fieldLabel:  '重&nbsp;复&nbsp;密&nbsp;码&nbsp;', name: 'password2',  confirmTo:'password', vtype:'password',vtypeText:'两次密码不一致！',maxLength: 20,/*minLength: 5,*/allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！',inputType :'password' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;',name: 'nameCh',maxLength: 20,allowBlank:false,itemCls:'floatCenter',regex : /[\u4e00-\u9fa5]/, regexText:'只能输入中文!',blankText:'不允许为空！' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;',name: 'phone',maxLength: 15,allowBlank:true,itemCls:'floatCenter',xtype: 'numberfield',blankText:'不允许为空！' }").append("\r\n");
//		buffer.append("                       		{fieldLabel:  '&nbsp;有&nbsp;效&nbsp;&nbsp;&nbsp;', 		name: 'valid',      allowBlank:true,itemCls:'floatCenter',blankText:'不允许为空!' }").append("\r\n");
		buffer.append("                         	], 																						").append("\r\n");
		buffer.append("                     buttonAlign:'center',																			").append("\r\n");
		buffer.append("                     buttons: [{text: '保存',handler:sava"+winid+"data}, 												").append("\r\n");
		buffer.append("                    			  {text: '关闭',handler:function(){Ext.getCmp('add"+winid+"Window').destroy();}}] 		").append("\r\n");
		buffer.append("                 }) ,																								").append("\r\n");
		buffer.append("                listeners:{close:function(){ add"+winid+"Window.close();}}   										").append("\r\n");
		buffer.append(" }).show();																											").append("\r\n");
		buffer.append("}																													").append("\r\n");
		//end-------------增加
	}
	
	/**
	 * @see 功能授权处理函数
	 * @author wuxiaoxu 20111110 
	 * @param buffer
	 */
	public void funFunction(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");//EssInterface_win
		buffer.append("  function fun"+winid+"(){                                                                   ").append("\r\n");
		buffer.append("     var userId ;                                                        			        ").append("\r\n");
		buffer.append("  	var fun_record="+winid+"grid.getSelectionModel().getSelections();                       ").append("\r\n");
		buffer.append("     if(fun_record.length < 1){                             	                                ").append("\r\n");
		buffer.append("     	Ext.Msg.alert('消息','请选择用户进行功能授权！');                                     	").append("\r\n");
		buffer.append("         return;                                                               			    ").append("\r\n");
		buffer.append("     }                                                                   			        ").append("\r\n");
		buffer.append("     if(fun_record.length > 1){                             	                                ").append("\r\n");
		buffer.append("     	Ext.Msg.alert('消息','请选择一位用户进行功能授权！');                                     ").append("\r\n");
		buffer.append("         return;                                                               			    ").append("\r\n");
		buffer.append("     }                                                                   			        ").append("\r\n");
		buffer.append("     userId = fun_record[0].data['id'] ;                                                     ").append("\r\n");
		//start---保存数据处理函数 在添加中应用
		buffer.append("var ToStore = new Ext.data.Store({															").append("\r\n");
		buffer.append("    id:'ToStore',																			").append("\r\n");
		buffer.append("	   proxy : new Ext.data.HttpProxy({url:'/menu/userMenus?userId='+userId}),					").append("\r\n");
		buffer.append("    reader: new Ext.data.JsonReader({														").append("\r\n");
		buffer.append("        totalProperty:'totalProperty',														").append("\r\n");
		buffer.append("        root:'dataList'},																	").append("\r\n");
		buffer.append("		[{name:'code'},{name:'desc'}])															").append("\r\n");
		buffer.append("});																							").append("\r\n");
		buffer.append("	ToStore.load();																				").append("\r\n");
		//-----获取系统功能列表数据----------
		buffer.append("																								").append("\r\n");
		buffer.append("	var FromStore = new Ext.data.Store({														").append("\r\n");
		buffer.append("		id:'FromStore',																			").append("\r\n");
		buffer.append("	    proxy : new Ext.data.HttpProxy({url:'/menu/otherMenus?userId='+userId}),				").append("\r\n");
		buffer.append("	    reader: new Ext.data.JsonReader({														").append("\r\n");
		buffer.append("			totalProperty:'totalProperty',														").append("\r\n");
		buffer.append("	        root:'dataList'},																	").append("\r\n");
		buffer.append("	        [{name:'code'},{name:'desc'}])														").append("\r\n");
		buffer.append("	});																							").append("\r\n");
		buffer.append("	FromStore.load();																			").append("\r\n");
		
		buffer.append("		function saveRelation(){																").append("\r\n");
		buffer.append("			var value = Ext.getCmp('sendmsgform');												").append("\r\n");
		buffer.append("			Ext.Ajax.request({																	").append("\r\n");
		buffer.append("				url : '/menu/saveMenus',														").append("\r\n");
		buffer.append("				callback:function(options,success,response){									").append("\r\n");
		buffer.append("					var json = Ext.util.JSON.decode(response.responseText);						").append("\r\n");
		buffer.append("					if('true'==json.success){													").append("\r\n");
		buffer.append("						Ext.Msg.alert('消息', '功能授权成功！');									").append("\r\n");
		buffer.append("						Ext.getCmp('fun"+winid+"Window').close();								").append("\r\n");
//		buffer.append("						Ext.Msg.alert('消息', json.msg);											").append("\r\n");
//		buffer.append("						Ext.getCmp('sendmsgWin').close();										").append("\r\n");
//		buffer.append("						var msggrid = Ext.getCmp('msgMenu');									").append("\r\n");
//		buffer.append("						msggrid.getStore().reload();											").append("\r\n");
		buffer.append("					}else{																		").append("\r\n");
		buffer.append("						Ext.Msg.alert('消息', '功能授权失败！');									").append("\r\n");
//		buffer.append("						Ext.Msg.alert('消息', json.msg);											").append("\r\n");
		buffer.append("					}																			").append("\r\n");
		buffer.append("				},																				").append("\r\n");
		buffer.append("				params : {																		").append("\r\n");
		buffer.append("					value : value.getValue(),													").append("\r\n");
		buffer.append("					userId: userId																").append("\r\n");
		buffer.append("				}																				").append("\r\n");
		buffer.append("			});																					").append("\r\n");
		buffer.append("		}																						").append("\r\n");
		
//		buffer.append("		function fun" + winid + "data(){															").append("\r\n");
//		buffer.append("			if(!Ext.getCmp('funWindow_panel').form.isValid()) return;							").append("\r\n");
//		buffer.append("			Ext.getCmp('funWindow_panel').form.doAction('submit',{								").append("\r\n");
//		buffer.append("         	url		:	'" + this.url+ "?method=editData',									").append("\r\n");
//		buffer.append("             method	:	'post',																").append("\r\n");
//		buffer.append("             success	:	function(){ 														").append("\r\n");              
//		buffer.append("                         	Ext.getCmp('"+winid+"grid').getStore().reload();				").append("\r\n");
//		buffer.append("                             Ext.Msg.alert('消息','保存成功!');    								").append("\r\n");
//		buffer.append( "							Ext.getCmp('fun"+winid+"Window').close();						").append("\r\n");
//		buffer.append("                         },																	").append("\r\n") ;
//		buffer.append("            failure	:	function() {														").append("\r\n") ;
//		buffer.append("                         	Ext.Msg.alert('消息','编辑信息保存失败!');							").append("\r\n") ;
//		buffer.append("                         }																	").append("\r\n") ;
//		buffer.append("         }																					").append("\r\n");
//		buffer.append("     )}																						").append("\r\n");
		//end----保存数据处理函数
		
		
		buffer.append(" 	new Ext.Window({  																		").append("\r\n");  
		buffer.append("    		id:'fun"+winid+"Window',															").append("\r\n");
		buffer.append("    		title:'功能授权',																		").append("\r\n");
		buffer.append("    		iconCls:'settings',																	").append("\r\n");
		buffer.append("    		width:700, 																			").append("\r\n");
		buffer.append("   		height:428, 																		").append("\r\n");
		buffer.append("	   		layout:'fit',																		").append("\r\n");
		buffer.append("    		plain : true, 																		").append("\r\n");
		buffer.append("    		modal : true,																		").append("\r\n");
		buffer.append("    		items:  new Ext.form.FormPanel({													").append("\r\n");
		buffer.append("    		id:'"+winid+"FormPanel',															").append("\r\n");
		buffer.append("	    	//width: bodyWidth-180,																").append("\r\n");
		buffer.append("	   		height: 340,																		").append("\r\n");
		buffer.append("	    	bodyStyle: 'padding:5px;',															").append("\r\n");
		buffer.append("	   		tbar:new Ext.Toolbar({																").append("\r\n");
		buffer.append("	    		items:[{																		").append("\r\n");
		buffer.append("				text:'保存',																		").append("\r\n");
		buffer.append("				pressed : true,																	").append("\r\n");
		buffer.append("				iconCls : 'save',																").append("\r\n");
		buffer.append("				handler:function(){																").append("\r\n");
		buffer.append("		  			saveRelation();																").append("\r\n");
		buffer.append("				}}]																				").append("\r\n");
		buffer.append("			}),																					").append("\r\n");
		buffer.append("	     	items:[{																			").append("\r\n");
		buffer.append("	         	xtype:'itemselector',															").append("\r\n");
		buffer.append("	         	name:'itemselector',															").append("\r\n");
	    buffer.append("	        	id:'sendmsgform',																").append("\r\n");
		buffer.append("	        	dataFields:['code', 'desc'],													").append("\r\n");
		buffer.append("	        	toData:[],																		").append("\r\n");
		buffer.append("	        	msWidth:220,																	").append("\r\n");
		buffer.append("	         	msHeight:260,																	").append("\r\n");
		buffer.append("	         	valueField:'code',																").append("\r\n");
		buffer.append("	         	displayField:'desc',															").append("\r\n");
		buffer.append("	          	imagePath:'/scripts/ext/ux/images/',											").append("\r\n");
		buffer.append("	          	toLegend:'分配功能',																").append("\r\n");
		buffer.append("	          	fromLegend:'系统功能',															").append("\r\n");
		buffer.append("	         	fromData:[],																	").append("\r\n");
		buffer.append("	           	fromStore:FromStore,															").append("\r\n");
		buffer.append("	           	toStore:ToStore         														").append("\r\n");
		buffer.append("	     	}]																					").append("\r\n");
		buffer.append("	  }),																						").append("\r\n");
		buffer.append("      	listeners:{close:function(){    													").append("\r\n");
		buffer.append("      		if(FromStore) {FromStore.removeAll(); FromStore = null;}						").append("\r\n");
		buffer.append("      		if(ToStore) {ToStore.removeAll(); ToStore = null;}   							").append("\r\n");
		buffer.append("      		if(Ext.getCmp('FromStore')) Ext.getCmp('FromStore').destroy();   				").append("\r\n");
		buffer.append("      		if(Ext.getCmp('ToStore')) Ext.getCmp('ToStore').destroy();;   					").append("\r\n");
		buffer.append("      	   	if(Ext.getCmp('sendmsgform')) Ext.getCmp('sendmsgform').destroy();				").append("\r\n");
		buffer.append("      	   	if(Ext.getCmp('"+winid+"FormPanel')) Ext.getCmp('"+winid+"FormPanel').destroy();").append("\r\n");
		buffer.append("      		if(Ext.getCmp('fun"+winid+"Window')) Ext.getCmp('fun"+winid+"Window').destroy();").append("\r\n");
		buffer.append("      	}}	   																				").append("\r\n");
		buffer.append("  	}).show();																			    ").append("\r\n");
		buffer.append("	}																							").append("\r\n");
		buffer.append("																								").append("\r\n");
	}
	
	/**
	 * @see 删除处理函数
	 * @author wuxiaoxu 20111018 
	 * @param buffer
	 */
	public void editFunction(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");//EssInterface_win
		buffer.append("  function edit"+winid+" (){                                                                 ").append("\r\n");
		buffer.append("  	var records="+winid+"grid.getSelectionModel().getSelections();                      	").append("\r\n");
		buffer.append("     if(records.length<1){                                                               	").append("\r\n");
		buffer.append("     	Ext.Msg.alert('消息','请选择要编辑的数据！');                                       	  	").append("\r\n");
		buffer.append("         return;                                                               			    ").append("\r\n");
		buffer.append("     }                                                                   			        ").append("\r\n");
		buffer.append("     if(records.length > 1){                                                               	").append("\r\n");
		buffer.append("     	Ext.Msg.alert('消息','请选择一条数据进行编辑！');                                       	").append("\r\n");
		buffer.append("         return;                                                               			    ").append("\r\n");
		buffer.append("     }                                                                   			        ").append("\r\n");
		//start---保存数据处理函数 在添加中应用
		buffer.append("		function edit"+winid+"data(){															").append("\r\n");
		buffer.append("			if(!Ext.getCmp('edit"+winid+"_panel').form.isValid()) return;						").append("\r\n");
		buffer.append("			Ext.getCmp('edit"+winid+"_panel').form.doAction('submit',{							").append("\r\n");
		buffer.append("         	url		:	'" + URL+ "/edit',								    				").append("\r\n");
		buffer.append("             method	:	'post',																").append("\r\n");
		buffer.append("             success	:	function(form,action){ 												").append("\r\n");    
		buffer.append("         		var json = Ext.util.JSON.decode(action.response.responseText);				").append("\r\n");
		buffer.append("         		if(json.success =='0'){														").append("\r\n");
		buffer.append("             		Ext.getCmp('"+winid+"grid').getStore().reload();						").append("\r\n");
		buffer.append("                	 	Ext.Msg.alert('消息',json.msg);    										").append("\r\n");
		buffer.append("						Ext.getCmp('edit"+winid+"Window').destroy();							").append("\r\n");
		buffer.append("         		}else{																		").append("\r\n");
		buffer.append("             		Ext.Msg.alert('消息',json.msg);											").append("\r\n");
		buffer.append("         		}																			").append("\r\n");
		buffer.append("            },																				").append("\r\n");
		buffer.append("            failure	:	function() {														").append("\r\n");
		buffer.append("                  Ext.Msg.alert('消息','编辑信息保存失败!');										").append("\r\n");
		buffer.append("            }																				").append("\r\n");
		buffer.append("         }																					").append("\r\n");
		buffer.append("     )}																						").append("\r\n");
		//end----保存数据处理函数
		buffer.append(" 	if(Ext.getCmp('edit"+winid+"Window')) Ext.getCmp('edit"+winid+"Window').destroy();		").append("\r\n");  
		buffer.append(" 	new Ext.Window({  																		").append("\r\n");  
		buffer.append("    		id:'edit"+winid+"Window',															").append("\r\n");
		buffer.append("    		title:'编辑用户',																		").append("\r\n");
		buffer.append("    		width:370, 																			").append("\r\n");
		buffer.append("   		height:220, 																		").append("\r\n");
		buffer.append("	   		layout:'fit',																		").append("\r\n");
		buffer.append("    		plain : true, 																		").append("\r\n");
		buffer.append("    		frame:true, 																		").append("\r\n");
		buffer.append("    		modal : true,																		").append("\r\n");
		buffer.append("    		items:  new Ext.FormPanel({															").append("\r\n");
		buffer.append("              		id:'edit"+winid+"_panel',												").append("\r\n");
		buffer.append("                     autoDestroy:true,														").append("\r\n");
		buffer.append("                     bodyStyle:'padding:5px 5px 0',											").append("\r\n");
//		buffer.append("                     width: 350,																").append("\r\n"); 
		buffer.append("                     defaults: {width: 230},													").append("\r\n");
		buffer.append("                     	defaultType: 'textfield',											").append("\r\n");
		buffer.append("                         items: [															").append("\r\n");
		buffer.append("                       		{fieldLabel:  'ID', name: 'id', value:records[0].data['id'],inputType  : 'hidden' },").append("\r\n");//设置成隐藏域
//		buffer.append("                       		{fieldLabel:  '&nbsp;用&nbsp;户&nbsp;名&nbsp;&nbsp;', 	name: 'name',   value:records[0].data['name'],inputType  : 'hidden' },").append("\r\n");//设置成隐藏域
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;', name: 'password', id: 'password',   maxLength: 20,/*minLength: 5,*/allowBlank:true,itemCls:'floatCenter',inputType :'password'},").append("\r\n");
		buffer.append("                       		{fieldLabel:  '重&nbsp;复&nbsp;密&nbsp;码&nbsp;',name: 'password2',confirmTo:'password', vtype:'password',vtypeText:'两次密码不一致!',maxLength: 20,/*minLength: 5,*/allowBlank: true,itemCls:'floatCenter',inputType :'password' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;',name: 'nameCh',value:records[0].data['nameCh'],maxLength: 20,allowBlank:false,itemCls:'floatCenter',regex : /[\u4e00-\u9fa5]/, regexText:'只能输入中文!',blankText:'不允许为空！' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;',name: 'phone', value:records[0].data['phone'],maxLength: 15,allowBlank:true,itemCls:'floatCenter',xtype: 'numberfield',blankText:'不允许为空！' },").append("\r\n");
		buffer.append("                       		{fieldLabel:  '&nbsp;&nbsp;有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;效&nbsp;&nbsp;&nbsp;',xtype: 'radiogroup',items: [").append("\r\n");
		buffer.append("         						{boxLabel: '有效', name: 'valid', inputValue: true,checked:records[0].data['valid']},").append("\r\n");
		buffer.append("        							{boxLabel: '无效', name: 'valid', inputValue: false,checked:!records[0].data['valid']}").append("\r\n");
		buffer.append("    							]}																").append("\r\n");
		buffer.append("                             ], 																").append("\r\n");
		buffer.append("                     	buttonAlign:'center',												").append("\r\n");
		buffer.append("                        	buttons: [{ text: '保存',handler:edit"+winid+"data},{text: '关闭',handler:function(){Ext.getCmp('edit"+winid+"Window').destroy();}}] ").append("\r\n");
		buffer.append("         		}) ,																		").append("\r\n");
		buffer.append("                 listeners:{close:function(){Ext.getCmp('edit"+winid+"Window').destroy();}}  ").append("\r\n");
		buffer.append("  	}).show();																			    ").append("\r\n");
		buffer.append("	}																							").append("\r\n");
	}
	
	/**
	 * @author wuxiaoxu 20111018 
	 * @param buffer
	 */
	public void rowdblclick(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
//		buffer.append("		Ext,get('"+winid+"grid').on('rowdblclick', function () {	").append("\r\n");
//		buffer.append("			 handler:{ edit"+winid+"; }								").append("\r\n");
//		buffer.append("		});//双击gridpanel的行，执行函数								").append("\r\n");
		buffer.append("		"+winid+"grid.addListener('rowdblclick', edit"+winid+");	").append("\r\n");
	}
	
	/**
	 * @see 分页combobox
	 * @author wuxiaoxu 20111018 
	 * @param buffer
	 */
	public void combox(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		buffer.append(" function getComboValue(){                                                                 	").append("\r\n");
		buffer.append(" 	var comboValue=Ext.getCmp('"+winid+"FormatCmb_id').value;                        		").append("\r\n");
		buffer.append("    	return comboValue==10?10:comboValue==20?20:comboValue==50?50:100;                       ").append("\r\n");
		buffer.append(" }                                                                      						").append("\r\n");
		//combobox
		buffer.append(" new Ext.form.ComboBox({                                                                     ").append("\r\n");
		buffer.append("     id:'"+winid+"FormatCmb_id',                                                     		").append("\r\n");
		buffer.append("     triggerAction:'all',                                                                   	").append("\r\n");
		buffer.append("     store:new Ext.data.SimpleStore({                                                        ").append("\r\n");
		buffer.append("     	fields:['value','display'],data:[[10,10], [20,20],[50,50],[100,100]]                ").append("\r\n");
		buffer.append("     }),                                                                   					").append("\r\n");
		buffer.append("     displayField:'display',                                                                 ").append("\r\n");
		buffer.append("     width:45,                                                                  		 		").append("\r\n");
		buffer.append("     mode:'local',                                                                   		").append("\r\n");
		buffer.append("     typeAhead:true,                                                                   		").append("\r\n");
		buffer.append("     value:'20',                                                                   			").append("\r\n");
		buffer.append("     valueField:'value',                                                                 	").append("\r\n");
		buffer.append("     forceSelection:true,                                                                   	").append("\r\n");
		buffer.append("     editable:true,                                                                   		").append("\r\n");
		buffer.append("     listeners:{                                                                   			").append("\r\n");
		buffer.append("     	select :function (){                                                                ").append("\r\n");
		buffer.append("         	Ext.getCmp('"+winid+"_bbar').pageSize=getComboValue();                			").append("\r\n");
		buffer.append("         	Ext.getCmp('"+winid+"grid').getStore().load({									").append("\r\n");
		buffer.append("         		params : {start : 0,limit : getComboValue()}                            	").append("\r\n");
		buffer.append("         	});																				").append("\r\n");
		buffer.append("       	}                                                                 					").append("\r\n");
		buffer.append("     }                                                                   					").append("\r\n");
		buffer.append(" });                                                                      					").append("\r\n");
	}
	
	/**
	 * @author wuxiaoxu 20111018 column
	 * @param buffer
	 */
	public void getColumn(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		
		buffer.append("	function valid(val) {																		").append("\r\n");
		buffer.append("		if (val == true) {																		").append("\r\n");
		buffer.append("			return '<span style=\"color:green;\">有效</span>';									").append("\r\n");
		buffer.append("     } else{																					").append("\r\n");
		buffer.append("     	return '<span style=\"color:red;\">无效</span>';										").append("\r\n");
		buffer.append("     }																						").append("\r\n");
		buffer.append("     return val;																				").append("\r\n");
		buffer.append(" }																							").append("\r\n");
		
		buffer.append("   var "+winid+"sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});  			").append("\r\n");
		buffer.append("   var "+winid+"cm = new Ext.grid.ColumnModel([                          					").append("\r\n");
		buffer.append("         new Ext.grid.RowNumberer(),                                     					").append("\r\n");
		buffer.append("        	"+winid+"sm,                                    									").append("\r\n");
//		buffer.append("         new Ext.grid.CheckboxSelectionModel(),                          					").append("\r\n");
		buffer.append("         {header:'ID',dataIndex:'id',sortable:true,width :100},                 				").append("\r\n");
		buffer.append("         {header:'用户名',dataIndex:'name',sortable:true,width :100},                    		").append("\r\n");
		buffer.append("         {header:'姓名',dataIndex:'nameCh',sortable:true,width :100},                 		").append("\r\n");
		buffer.append("         {header:'手机',dataIndex:'phone',sortable:true,width :100},                     		").append("\r\n");
//		buffer.append("         {header:'家庭住址',dataIndex:'address',sortable:true,width :100},                 	").append("\r\n");
//		buffer.append("         {header:'邮箱',dataIndex:'email',sortable:true,width :100},                       	").append("\r\n");
//		buffer.append("         {header:'密码提示',dataIndex:'password_hint',sortable:true,hidden :true,width :100}, 	").append("\r\n");
//		buffer.append("         {header:'城市',dataIndex:'city',sortable:true,hidden :true,width :100},            	").append("\r\n");
//		buffer.append("         {header:'开启',dataIndex:'enabled',sortable:true,width :100},                      	").append("\r\n");
		buffer.append("         {header:'有效',dataIndex:'valid',sortable:true,width :100,renderer:valid}           	").append("\r\n");
		buffer.append("   ]);		                                                       							").append("\r\n");
	}
	
	/**
	 * @author wuxiaoxu 20111018 数据源 datastore
	 * @param buffer
	 */
	public void getData(StringBuffer buffer){
//		获取数据库表数据
		String winid = pageContext.getRequest().getParameter("parentWinId");//
		buffer.append("   var "+winid+"ds = new Ext.data.Store({                                ").append("\r\n");
		buffer.append("   	proxy : new Ext.data.HttpProxy({                                    ").append("\r\n");
		buffer.append("     	url : '" + URL + "/list'  			           					").append("\r\n");
		buffer.append("         }),                                                             ").append("\r\n");
		buffer.append("    reader :  new Ext.data.JsonReader({                                  ").append("\r\n");
		buffer.append("    				totalProperty : 'resultSize',                           ").append("\r\n");
		buffer.append("    				root : 'dataList'                                       ").append("\r\n");
		buffer.append("    			 },[                                                        ").append("\r\n");
		buffer.append("     			{name:'id'},                                            ").append("\r\n");
		buffer.append("     			{name:'name'},                                         	").append("\r\n");
		buffer.append("     			{name:'nameCh'},                                   	 	").append("\r\n");
		buffer.append("     			{name:'phone'},                                     	").append("\r\n");
		buffer.append("     			{name:'valid'}                                   		").append("\r\n");
//		buffer.append("     			{name:'address'},                                       ").append("\r\n");
//		buffer.append("     			{name:'city'},                                          ").append("\r\n");
//		buffer.append("     			{name:'email'},                                         ").append("\r\n");
//		buffer.append("     			{name:'password_hint'},                                 ").append("\r\n");
//		buffer.append("     			{name:'enabled'},                                       ").append("\r\n");
//		buffer.append("     			{name:'homephone'},                                     ").append("\r\n");
//		buffer.append("     			{name:'mobile'},                                        ").append("\r\n");
//		buffer.append("     			{name:'islock'}                                         ").append("\r\n");
		buffer.append("    			])                                                          ").append("\r\n");
		buffer.append("    });                                                                  ").append("\r\n");
		buffer.append("   "+winid+"ds.load();                                                   ").append("\r\n");
		
	}
	
	/**
	 * @author wuxiaoxu 20111018 GridPanel
	 * @param buffer
	 */
	public void getGridPanel(StringBuffer buffer){
		String winid  = pageContext.getRequest().getParameter("parentWinId");//EssInterface_win
		
		buffer.append("	var "+winid+"grid = new Ext.grid.GridPanel({     			           	").append("\r\n");
		buffer.append("     renderTo: 'UserHomeTag',                                         	").append("\r\n");
		buffer.append("     stripeRows:true, 													").append("\r\n");//设置不同行颜色不同
//		buffer.append("     autoWidth: true, 													").append("\r\n");//一定不能有 不然影响滚动条
		buffer.append("     id: '"+winid+"grid',                                              	").append("\r\n");
		buffer.append("     ds: "+winid+"ds,                                                   	").append("\r\n");
//		buffer.append("   	sm: new Ext.grid.RowSelectionModel({singleSelect:true}),          	").append("\r\n");
		buffer.append("   	sm: "+winid+"sm,          											").append("\r\n");
		buffer.append("     cm: "+winid+"cm ,                                                  	").append("\r\n");
		buffer.append("     frame:false,               											").append("\r\n");
		buffer.append("     width: Ext.getCmp('"+winid+"').getInnerWidth(),               		").append("\r\n");
		buffer.append("    	height:  Ext.getCmp('"+winid+"').getInnerHeight(),	             	").append("\r\n");
		buffer.append("   	viewConfig:{                										").append("\r\n");
		buffer.append("     	autoScroll:true,              									").append("\r\n");
		buffer.append("     	forceFit:false                                                  ").append("\r\n");
		buffer.append("     },		          													").append("\r\n");
		
		buffer.append("     tbar	:[{ text:'添加',                                            	").append("\r\n");
		buffer.append("                 iconCls:'add',                                         	").append("\r\n");
		buffer.append("                 handler : add"+winid+"                                 	").append("\r\n");
		buffer.append("                },'-',{                                               	").append("\r\n");
		buffer.append("                 text : '删除',                                         	").append("\r\n");
		buffer.append("                 iconCls : 'remove',                                    	").append("\r\n");
		buffer.append("                 handler : del"+winid+"                                	").append("\r\n");
		buffer.append("                },'-',{                                               	").append("\r\n");
		buffer.append("                 text : '编辑',                                         	").append("\r\n");
		buffer.append("                 iconCls : 'edit',                                    	").append("\r\n");
		buffer.append("                 handler : edit"+winid+"                                	").append("\r\n");
		buffer.append("                },'-',{                                               	").append("\r\n");
		buffer.append("                 text : '功能授权',                                       	").append("\r\n");
		buffer.append("                 iconCls : 'settings',                                   ").append("\r\n");
		buffer.append("                 handler : fun"+winid+"                                	").append("\r\n");
		buffer.append("             }],                                                		   	").append("\r\n");
		buffer.append("     bbar : new Ext.PagingToolbar({                                     	").append("\r\n");
		buffer.append("            	 id : '"+winid+"_bbar',                          			").append("\r\n");
		buffer.append("              pageSize :getComboValue() ,                              	").append("\r\n");
		buffer.append("              store : "+winid+"ds,                            			").append("\r\n");
		buffer.append("              displayInfo : true,                                     	").append("\r\n");
		buffer.append("              displayMsg: '当前显示 {0} - {1}条 共 {2}条',                 	").append("\r\n");
		buffer.append("              emptyMsg: '没有记录', 	                                   	").append("\r\n");
		buffer.append("              beforePageText: '第',	                                   	").append("\r\n");
		buffer.append("              afterPageText: '页 共{0}页',	                               	").append("\r\n");
		buffer.append("              items : [Ext.getCmp('"+winid+"FormatCmb_id')]     			").append("\r\n");
		buffer.append("            })                                                    	   	").append("\r\n");
		buffer.append("                                                               		   	").append("\r\n");
		buffer.append(" });                                                                    	").append("\r\n");

		buffer.append(" Ext.getCmp('"+winid+"').on('resize', function(pw,w,h) {   		 		").append("\r\n");
		buffer.append("      Ext.getCmp('"+winid+"grid').setHeight(pw.getInnerHeight());      	").append("\r\n");
		buffer.append("      Ext.getCmp('"+winid+"grid').setWidth(pw.getInnerWidth());          ").append("\r\n");
		buffer.append("  });                                                              	    ").append("\r\n");
	}
	
	/**
	 * @author wuxiaoxu 20111018 处理函数
	 * @param buffer
	 */
	 public int doEndTag() throws JspException {
    	release();
    	return EVAL_PAGE;
	 }
	 public void release(){
		super.release();
	 }

}
