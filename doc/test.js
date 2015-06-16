  Ext.apply(Ext.form.VTypes,{   													
     password:function(val,field){												
     	if(field.confirmTo){													
     		var pwd=Ext.get(field.confirmTo);									
     		return (val==pwd.getValue());										
     	}																		
     	return true;															
     }																			
  });   																			
     																			
  function delUserManage_win(){                                            		    
     var del_Conunt=UserManage_wingrid.getSelectionModel().getCount();                
     if(del_Conunt<1){                                                           
         Ext.Msg.alert('消息','请选择要操作的数据！');      		 	 	 	 	    
     	return ;                                                                
     }                                                     						
     var del_record=UserManage_wingrid.getSelectionModel().getSelections();           
     var ids='';                                                        		    
     for(var i=0; i<del_record.length; i++){                                     
         ids += del_record[i].data.id + ',';                            		    
     }                                                                   		
		Ext.Msg.confirm('消息','确定删除数据?',function(buttonobj){					
			if(buttonobj=='yes'){													
				Ext.Ajax.request({													
					url:'/user/delete',										
					params : {														
						ids : ids													
					},																
					callback:function(options,success,response){					
						var json = Ext.util.JSON.decode(response.responseText);		
       				if(json.success){											
							Ext.Msg.alert('消息',json.msg);							
							Ext.getCmp('UserManage_wingrid').getStore().reload();		
        				}else{														
							Ext.Msg.alert('消息',json.msg);							
					 	}															
					}																
				});																	
				Ext.getCmp('UserManage_wingrid').getStore().reload();					
			}																		
		});																			
}                                                                     	        
function addUserManage_win(){                                                         
		function savaUserManage_windata(){												
   		if(!Ext.getCmp('addUserManage_winWindow_panel').form.isValid()) return;		
   		Ext.getCmp('addUserManage_winWindow_panel').form.doAction('submit',{			
         	url:'/user/save',												
             method:'post',														
             success:function(form,action){ 										
         		var json = Ext.util.JSON.decode(action.response.responseText);	
         		if(json.success =='0'){											
             		Ext.getCmp('UserManage_wingrid').getStore().reload();			
                	 	Ext.Msg.alert('消息',json.msg);    							
						Ext.getCmp('addUserManage_winWindow').destroy();					
         		}else{															
             		Ext.Msg.alert('消息',json.msg);								
         		}																
             },																	
             failure:function() {												
             	Ext.Msg.alert('消息','保存失败');									
             }																	
         })																		
    }																			
   if(Ext.getCmp('addUserManage_winWindow'))											
   	Ext.getCmp('addUserManage_winWindow').destroy();									
   new Ext.Window({  															
    id:'addUserManage_winWindow',														
    title	:	'添加用户',														
    width	:	370, 															
    height	:	220, 															
	   layout	:	'fit',															
    plain 	:	true, 															
    modal 	:	true,															
    items	:  	new Ext.FormPanel({												
                 	id	:	'addUserManage_winWindow_panel',							
                     autoDestroy:true,											
                  	bodyStyle:'padding:5px 5px 0',								
                    	defaults: {width: 230},										
                 	defaultType: 'textfield',									
                   	items: [													
                       		{fieldLabel:  '&nbsp;用&nbsp;&nbsp;户&nbsp;&nbsp;名&nbsp;&nbsp;', name: 'name',vtype:'alphanum',maxLength: 20,minLength: 2,allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！' },
                       		{fieldLabel:  '&nbsp;&nbsp;密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;',name: 'password',id: 'password',maxLength: 20,minLength: 5,allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！' ,inputType :'password'},
                       		{fieldLabel:  '重&nbsp;复&nbsp;密&nbsp;码&nbsp;', name: 'password2',  confirmTo:'password', vtype:'password',vtypeText:'两次密码不一致！',maxLength: 20,minLength: 5,allowBlank:false,itemCls:'floatCenter',blankText:'不允许为空！',inputType :'password' },
                       		{fieldLabel:  '&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;',name: 'nameCh',maxLength: 20,allowBlank:false,itemCls:'floatCenter',regex : /[一-龥]/, regexText:'只能输入中文!',blankText:'不允许为空！' },
                       		{fieldLabel:  '&nbsp;&nbsp;手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;',name: 'phone',maxLength: 15,allowBlank:true,itemCls:'floatCenter',xtype: 'numberfield',blankText:'不允许为空！' }
                         	], 																						
                     buttons: [{text: '保存',handler:savaUserManage_windata}, 												
                    			  {text: '关闭',handler:function(){Ext.getCmp('addUserManage_winWindow').destroy();}}] 		
                 }) ,																								
                listeners:{close:function(){ addUserManage_winWindow.close();}}   										
 }).show();																											
}																													
  function funUserManage_win(){                                                                   
     var userId ;                                                        			        
  	var fun_record=UserManage_wingrid.getSelectionModel().getSelections();                       
     if(fun_record.length < 1){                             	                                
     	Ext.Msg.alert('消息','请选择用户进行功能授权！');                                     	
         return;                                                               			    
     }                                                                   			        
     if(fun_record.length > 1){                             	                                
     	Ext.Msg.alert('消息','请选择一位用户进行功能授权！');                                     
         return;                                                               			    
     }                                                                   			        
     userId = fun_record[0].data['id'] ;                                                     
var ToStore = new Ext.data.Store({															
    id:'ToStore',																			
	   proxy : new Ext.data.HttpProxy({url:'/menu/userMenus?userId='+userId}),					
    reader: new Ext.data.JsonReader({														
        totalProperty:'totalProperty',														
        root:'dataList'},																	
		[{name:'code'},{name:'desc'}])															
});																							
	ToStore.load();																				
																								
	var FromStore = new Ext.data.Store({														
		id:'FromStore',																			
	    proxy : new Ext.data.HttpProxy({url:'/menu/otherMenus?userId='+userId}),				
	    reader: new Ext.data.JsonReader({														
			totalProperty:'totalProperty',														
	        root:'dataList'},																	
	        [{name:'code'},{name:'desc'}])														
	});																							
	FromStore.load();																			
		function saveRelation(){																
			var value = Ext.getCmp('sendmsgform');												
			Ext.Ajax.request({																	
				url : '/menu/saveMenus',														
				callback:function(options,success,response){									
					var json = Ext.util.JSON.decode(response.responseText);						
					if('true'==json.success){													
						Ext.Msg.alert('消息', '功能授权成功！');									
						Ext.getCmp('funUserManage_winWindow').close();								
					}else{																		
						Ext.Msg.alert('消息', '功能授权失败！');									
					}																			
				},																				
				params : {																		
					value : value.getValue(),													
					userId: userId																
				}																				
			});																					
		}																						
 	new Ext.Window({  																		
    		id:'funUserManage_winWindow',															
    		title:'功能授权',																		
    		iconCls:'settings',																	
    		width:700, 																			
   		height:428, 																		
	   		layout:'fit',																		
    		plain : true, 																		
    		modal : true,																		
    		items:  new Ext.form.FormPanel({													
    		id:'UserManage_winFormPanel',															
	    	//width: bodyWidth-180,																
	   		height: 340,																		
	    	bodyStyle: 'padding:5px;',															
	   		tbar:new Ext.Toolbar({																
	    		items:[	{																		
				text:'保存',																		
				pressed : true,																	
				iconCls : 'save',																
				handler:function(){																
		  			saveRelation();																
				}}]																				
			}),																					
	     	items:[{																			
	         	xtype:'itemselector',															
	         	name:'itemselector',															
	        	id:'sendmsgform',																
	        	dataFields:['code', 'desc'],													
	        	toData:[],																		
	        	msWidth:220,																	
	         	msHeight:260,																	
	         	valueField:'code',																
	         	displayField:'desc',															
	          	imagePath:'/scripts/ext/ux/images/',											
	          	toLegend:'分配功能',																
	          	fromLegend:'系统功能',															
	         	fromData:[],																	
	           	fromStore:FromStore,															
	           	toStore:ToStore         														
	     	}]																					
	  }),																						
      	listeners:{close:function(){    													
      		if(FromStore) {FromStore.removeAll(); FromStore = null;}						
      		if(ToStore) {ToStore.removeAll(); ToStore = null;}   							
      		if(Ext.getCmp('FromStore')) Ext.getCmp('FromStore').destroy();   				
      		if(Ext.getCmp('ToStore')) Ext.getCmp('ToStore').destroy();;   					
      	   	if(Ext.getCmp('sendmsgform')) Ext.getCmp('sendmsgform').destroy();				
      	   	if(Ext.getCmp('UserManage_winFormPanel')) Ext.getCmp('UserManage_winFormPanel').destroy();
      		if(Ext.getCmp('funUserManage_winWindow')) Ext.getCmp('funUserManage_winWindow').destroy();
      	}}	   																				
  	}).show();																			    
	}																							
																								
  function editUserManage_win (){                                                                 
  	var records=UserManage_wingrid.getSelectionModel().getSelections();                      	
     if(records.length<1){                                                               	
     	Ext.Msg.alert('消息','请选择要编辑的数据！');                                       	  	
         return;                                                               			    
     }                                                                   			        
     if(records.length > 1){                                                               	
     	Ext.Msg.alert('消息','请选择一条数据进行编辑！');                                       	
         return;                                                               			    
     }                                                                   			        
		function editUserManage_windata(){															
			if(!Ext.getCmp('editUserManage_win_panel').form.isValid()) return;						
			Ext.getCmp('editUserManage_win_panel').form.doAction('submit',{							
         	url		:	'/user/edit',								    				
             method	:	'post',																
             success	:	function(form,action){ 												
         		var json = Ext.util.JSON.decode(action.response.responseText);				
         		if(json.success =='0'){														
             		Ext.getCmp('UserManage_wingrid').getStore().reload();						
                	 	Ext.Msg.alert('消息',json.msg);    										
						Ext.getCmp('editUserManage_winWindow').destroy();							
         		}else{																		
             		Ext.Msg.alert('消息',json.msg);											
         		}																			
            },																				
            failure	:	function() {														
                  Ext.Msg.alert('消息','编辑信息保存失败!');										
            }																				
         }																					
     )}																						
 	if(Ext.getCmp('editUserManage_winWindow')) Ext.getCmp('editUserManage_winWindow').destroy();		
 	new Ext.Window({  																		
    		id:'editUserManage_winWindow',															
    		title:'编辑用户',																		
    		width:370, 																			
   		height:220, 																		
	   		layout:'fit',																		
    		plain : true, 																		
    		frame:true, 																		
    		modal : true,																		
    		items:  new Ext.FormPanel({															
              		id:'editUserManage_win_panel',												
                     autoDestroy:true,														
                     bodyStyle:'padding:5px 5px 0',											
                     defaults: {width: 230},													
                     	defaultType: 'textfield',											
                         items: [															
                       		{fieldLabel:  'ID', name: 'id', value:records[0].data['id'],inputType  : 'hidden' },
                       		{fieldLabel:  '&nbsp;&nbsp;密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;', name: 'password', id: 'password',   maxLength: 20,minLength: 5,allowBlank:true,itemCls:'floatCenter',inputType :'password'},
                       		{fieldLabel:  '重&nbsp;复&nbsp;密&nbsp;码&nbsp;',name: 'password2',confirmTo:'password', vtype:'password',vtypeText:'两次密码不一致！',maxLength: 20,minLength: 5,allowBlank: true,itemCls:'floatCenter',inputType :'password' },
                       		{fieldLabel:  '&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;',name: 'nameCh',value:records[0].data['nameCh'],maxLength: 20,allowBlank:false,itemCls:'floatCenter',regex : /[一-龥]/, regexText:'只能输入中文!',blankText:'不允许为空！' },
                       		{fieldLabel:  '&nbsp;&nbsp;手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;',name: 'phone', value:records[0].data['phone'],maxLength: 15,allowBlank:true,itemCls:'floatCenter',xtype: 'numberfield',blankText:'不允许为空！' },
                       		{fieldLabel:  '&nbsp;&nbsp;锁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定&nbsp;&nbsp;&nbsp;',name: 'valid', value:records[0].data['valid'],allowBlank:true,itemCls:'floatCenter',blankText:'不允许为空！' }
                             ], 															
                        	buttons: [{ text: '保存',handler:editUserManage_windata},{text: '关闭',handler:function(){Ext.getCmp('editUserManage_winWindow').destroy();}}] 
         		}) ,																		
                 listeners:{close:function(){Ext.getCmp('editUserManage_winWindow').destroy();}}   				
  	}).show();																			    
	}																							
 function getComboValue(){                                                                 	
 	var comboValue=Ext.getCmp('UserManage_winFormatCmb_id').value;                        		
    	return comboValue==10?10:comboValue==20?20:comboValue==50?50:100;                       
 }                                                                      						
 new Ext.form.ComboBox({                                                                     
     id:'UserManage_winFormatCmb_id',                                                     		
     triggerAction:'all',                                                                   	
     store:new Ext.data.SimpleStore({                                                        
     	fields:['value','display'],data:[[10,10], [20,20],[50,50],[100,100]]                
     }),                                                                   					
     displayField:'display',                                                                 
     width:45,                                                                  		 		
     mode:'local',                                                                   		
     typeAhead:true,                                                                   		
     value:'20',                                                                   			
     valueField:'value',                                                                 	
     forceSelection:true,                                                                   	
     editable:true,                                                                   		
     listeners:{                                                                   			
     	select :function (){                                                                
         	Ext.getCmp('UserManage_win_bbar').pageSize=getComboValue();                			
         	Ext.getCmp('UserManage_wingrid').getStore().load({									
         		params : {start : 0,limit : getComboValue()}                            	
         	});																				
       	}                                                                 					
     }                                                                   					
 });                                                                      					
        	                                     												
        	                                     												
	function valid(val) {																		
		if (val == 'true') {																	
			return '<span style='color:green;'>' + val + '</span>';							
     } else if (val < 0) {																	
     	return '<span style='color:red;'>' + val + '</span>';								
     }																						
     return val;																				
 }																							
   var UserManage_winsm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});  			
   var UserManage_wincm = new Ext.grid.ColumnModel([                          					
        	                                     												
         new Ext.grid.RowNumberer(),                                     					
        	UserManage_winsm,                                    									
         {header:'ID',dataIndex:'id',sortable:true,width :100},                 				
         {header:'用户名',dataIndex:'name',sortable:true,width :100},                    		
         {header:'姓名',dataIndex:'nameCh',sortable:true,width :100},                 		
         {header:'手机',dataIndex:'phone',sortable:true,width :100},                     		
         {header:'有效',dataIndex:'valid',sortable:true,width :100,renderer:valid}           	
     	]);                                                       							
   var UserManage_winds = new Ext.data.Store({                                
   	proxy : new Ext.data.HttpProxy({                                    
     	url : '/user/list'  			           					
         }),                                                             
    reader :  new Ext.data.JsonReader({                                  
    				totalProperty : 'resultSize',                           
    				root : 'dataList'                                       
    			 },[                                                        
     			{name:'id'},                                            
     			{name:'name'},                                         	
     			{name:'nameCh'},                                   	 	
     			{name:'phone'},                                     	
     			{name:'valid'}                                   		
    			])                                                          
    });                                                                  
   UserManage_winds.load();                                                   
	var UserManage_wingrid = new Ext.grid.GridPanel({     			           	
     renderTo: 'UserHomeTag',                                         	
     stripeRows:true, 													
     id: 'UserManage_wingrid',                                              	
     ds: UserManage_winds,                                                   	
   	sm: UserManage_winsm,          											
     cm: UserManage_wincm ,                                                  	
     frame:false,               											
     width: Ext.getCmp('UserManage_win').getInnerWidth(),               		
    	height:  Ext.getCmp('UserManage_win').getInnerHeight(),	             	
   	viewConfig:{                										
     	autoScroll:true,              									
     	forceFit:false                                                  
     },		          													
     tbar	:[{ text:'添加',                                            	
                 iconCls:'add',                                         	
                 handler : addUserManage_win                                 	
                },'-',{                                               	
                 text : '删除',                                         	
                 iconCls : 'remove',                                    	
                 handler : delUserManage_win                                	
                },'-',{                                               	
                 text : '编辑',                                         	
                 iconCls : 'edit',                                    	
                 handler : editUserManage_win                                	
                },'-',{                                               	
                 text : '功能授权',                                       	
                 iconCls : 'settings',                                   
                 handler : funUserManage_win                                	
             }],                                                		   	
     bbar : new Ext.PagingToolbar({                                     	
            	 id : 'UserManage_win_bbar',                          			
              pageSize :getComboValue() ,                              	
              store : UserManage_winds,                            			
              displayInfo : true,                                     	
              displayMsg: '当前显示 {0} - {1}条 共 {2}条',                 	
              emptyMsg: '没有记录', 	                                   	
              beforePageText: '第',	                                   	
              afterPageText: '页 共{0}页',	                               	
              items : [Ext.getCmp('UserManage_winFormatCmb_id')]     			
            })                                                    	   	
                                                               		   	
 });                                                                    	
 Ext.getCmp('UserManage_win').on('resize', function(pw,w,h) {   		 		
      Ext.getCmp('UserManage_wingrid').setHeight(pw.getInnerHeight());      	
      Ext.getCmp('UserManage_wingrid').setWidth(pw.getInnerWidth());          
  });                                                              	    
		UserManage_wingrid.addListener('rowdblclick', editUserManage_win);								

