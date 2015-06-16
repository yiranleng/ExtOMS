package cn.superflying.oms.webapp.taglib.test;

import javax.servlet.jsp.JspException;

import cn.superflying.oms.webapp.taglib.BaseTag;

public class TestGridTag extends BaseTag {
	
	private static final String URL = "/testTree";

	private static final long serialVersionUID = 1L;
	
	public int doStartTag() throws JspException {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<script type='text/javascript'>").append("\r\n");
		
		FormPanel(buffer);
		
		EditPanel(buffer);

		MainPanel(buffer);//删除函数

		resize(buffer);//
		
		close(buffer);//wuxiaoxu 20111215
		// 组装数据
		buffer.append("</script>").append("\r\n");
		buffer.append("<div id='TestGridTagDiv'/>").append("\r\n");		
		
		this.writeBuffer(buffer);
		return EVAL_BODY_INCLUDE;
	}
	
	/**
	 * @author wuxiaoxu 20111125 右侧下面的EditGridPanel
	 * @param buffer
	 */
	public void EditPanel(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		//dataStore
		buffer.append(" 	"+winid+"Gridds=new Ext.data.Store({												").append("\r\n");
		buffer.append(" 		pruneModifiedRecords : true, 													").append("\r\n");
		buffer.append(" 	    proxy:new Ext.data.HttpProxy({													").append("\r\n");
		buffer.append(" 			url:'"+ URL +"/list'														").append("\r\n");
		buffer.append(" 		}),																				").append("\r\n");
		buffer.append(" 		reader:new Ext.data.JsonReader({												").append("\r\n");
		buffer.append(" 			totalProperty:'resultSize',													").append("\r\n");
		buffer.append(" 			root:'dataList'																").append("\r\n");
		buffer.append("    			 },[                                                        				").append("\r\n");
		buffer.append("     			{name:'id'},                                           					").append("\r\n");
		buffer.append("     			{name:'name'},                                         					").append("\r\n");
		buffer.append("     			{name:'nameCh'},                                   	 					").append("\r\n");
		buffer.append("     			{name:'phone'},                                     					").append("\r\n");
		buffer.append("     			{name:'valid'}                                   						").append("\r\n");
		buffer.append("    			])                                                          				").append("\r\n");
		buffer.append(" 	});																					").append("\r\n");

		//ColumnModel
		buffer.append("   var "+winid+"Gridsm=new Ext.grid.CheckboxSelectionModel();							").append("\r\n");
		buffer.append("   var "+winid+"Gridcm = new Ext.grid.ColumnModel([                          			").append("\r\n");
		buffer.append("         new Ext.grid.RowNumberer(),                                     				").append("\r\n");
		buffer.append("        	"+winid+"Gridsm,                                    							").append("\r\n");
		buffer.append("         {header:'ID',dataIndex:'id',sortable:true,width :100},                 			").append("\r\n");
		buffer.append("         {header:'用户名',dataIndex:'name',sortable:true,width :100},                    	").append("\r\n");
		buffer.append("         {header:'姓名',dataIndex:'nameCh',sortable:true,width :200},                 	").append("\r\n");
		buffer.append("         {header:'手机',dataIndex:'phone',sortable:true,width :200},                     	").append("\r\n");
		buffer.append("         {header:'有效',dataIndex:'valid',sortable:true,width :100}           			").append("\r\n");
		buffer.append("   ]);		                                                       						").append("\r\n");
		
		//EditorGridPanel
		buffer.append(" 	var "+winid+"EditGrid=new Ext.grid.EditorGridPanel({								").append("\r\n");
		buffer.append(" 		clicksToEdit:1,																	").append("\r\n");
		buffer.append(" 		id:'"+winid+"EditGrid',															").append("\r\n");
		buffer.append(" 		width:Ext.getCmp('"+winid+"').getInnerWidth()-300,								").append("\r\n");
		//buffer.append(" 		region : 'center',																").append("\r\n");
		buffer.append(" 		anchor: '100% 50%',																").append("\r\n");
		buffer.append(" 		animCollapse:false ,															").append("\r\n");
		buffer.append(" 		stripeRows:true,																").append("\r\n");
		buffer.append(" 		iconCls   : 'icon-grid',														").append("\r\n");
		buffer.append(" 		height : Ext.getCmp('"+winid+"').getInnerHeight(),								").append("\r\n");
		buffer.append(" 		enableHdMenu :true,																").append("\r\n");
		buffer.append(" 		enableDragDrop: true,															").append("\r\n");
		buffer.append(" 		ddGroup: 'dd',																	").append("\r\n");
		buffer.append(" 		store:"+winid+"Gridds,															").append("\r\n");
		buffer.append(" 		cm:"+winid+"Gridcm,																").append("\r\n");
		buffer.append(" 		sm:new Ext.grid.CheckboxSelectionModel(),										").append("\r\n");
		buffer.append(" 		title: '数据浏览' , 																").append("\r\n");
		buffer.append(" 		collapsible : true,																").append("\r\n");
		buffer.append(" 		collapsed : false																").append("\r\n");
//		buffer.append(" 		titleCollapse :true																").append("\r\n");
		buffer.append(" 	});																					").append("\r\n");
	}
	
	/**
	 * @author wuxiaoxu 20111125 formPanel
	 * @param buffer
	 */
	public void FormPanel(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		buffer.append("                                                                     	       	 	").append("\r\n");
		buffer.append(" var "+winid+"nothfrom= new Ext.form.FormPanel({										").append("\r\n");
		buffer.append(" 	id:'"+winid+"nothfrom',															").append("\r\n");
		buffer.append(" 	width:Ext.getCmp('"+winid+"').getInnerWidth()-210,								").append("\r\n");
		buffer.append(" 	animCollapse:false ,															").append("\r\n");
		buffer.append(" 	anchor: '100% 50%',																").append("\r\n");
//		buffer.append(" 	region : 'north',																").append("\r\n");
		buffer.append(" 	iconCls   : 'tabs',																").append("\r\n");
		buffer.append(" 	collapsible : true,																").append("\r\n");
		buffer.append(" 	collapsed : false,																").append("\r\n");
		buffer.append(" 	title: '数据编辑',																").append("\r\n");
		buffer.append(" 	waitMsgTarget:true,titleCollapse :true,											").append("\r\n");
		buffer.append(" 	autoScroll:true,																").append("\r\n");
//		buffer.append(" 	height : Ext.getCmp('"+winid+"').getInnerHeight()*0.4,							").append("\r\n");
		buffer.append(" 	height : Ext.getCmp('"+winid+"').height*0.5,									").append("\r\n");
		buffer.append(" 	bodyStyle:'padding:2px 2px 2px 2px',											").append("\r\n");
		buffer.append(" 	layout:'form',																	").append("\r\n");
		buffer.append(" 	defaults: {itemCls :'floatLeft'},												").append("\r\n");
		buffer.append(" 	layoutConfig: {labelSeparator: '：'}, 											").append("\r\n");
		buffer.append(" 	items : [																		").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden(),														").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'fileName',xtype:'textfield',labelSeparator:''}),	").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'filePath',xtype:'textfield',labelSeparator:''}),	").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'fileType',xtype:'textfield',labelSeparator:''}),	").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'fileType_file',xtype:'textfield',labelSeparator:''	}),").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'file_isRename',xtype:'textfield',labelSeparator:''}),").append("\r\n");
		buffer.append(" 		new Ext.form.Hidden({id:'fileState',xtype:'textfield',labelSeparator:''})	").append("\r\n");
		buffer.append(" 	],																				").append("\r\n");
		buffer.append(" tbar: new Ext.Toolbar(																").append("\r\n");
		buffer.append(" 		{id:'archivefromFormTbar',													").append("\r\n");
		buffer.append(" 			items:[      															").append("\r\n");
		buffer.append(" 				{id:'archivefromformsave', tooltip: '保存数据', text: '保存',iconCls:'save',disabled :true},'-',").append("\r\n");
		buffer.append(" 				{id:'archivefromformadd', tooltip: '选中一条数据按选中数据进行携带字段,不选中数据则不携带任何字段!',text:'添加',iconCls:'add',disabled :true},'-',").append("\r\n");
		buffer.append(" 				{id:'formScan_id',text :'扫描',iconCls :'ScanFile',hidden:true},").append("\r\n");
		buffer.append(" 				{id:'archivefromformreset', tooltip: '复位',text: '复位',disabled :false,iconCls:'remove',handler:function(){ "+winid+"nothfrom.form.reset(); Ext.getCmp('"+winid+"nothfrom').form.isValid();}}").append("\r\n"); 
		buffer.append("        ]})																			").append("\r\n");
		buffer.append(" });																					").append("\r\n");
	}
	
	
	/**
	 * @author wuxiaoxu 20111124 动态树
	 * @param buffer
	 */
	public void MainPanel(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		//wuxiaoxu 主Panel
		buffer.append("new Ext.Panel({																		").append("\r\n");
		buffer.append("		height : Ext.getCmp('"+winid+"').height-35,										").append("\r\n");
		buffer.append("		width : Ext.getCmp('"+winid+"').width-20,										").append("\r\n");
		//buffer.append("		border : false,																").append("\r\n");
		
//		buffer.append("		viewConfig: {																	").append("\r\n");
//		buffer.append("			forceFit:true  																").append("\r\n");
//		buffer.append("		},																				").append("\r\n");
		buffer.append("		layout : 'border',																").append("\r\n");
		buffer.append("		id : '"+winid+"MainPanel',														").append("\r\n");
		buffer.append("		renderTo : 'TestGridTagDiv',													").append("\r\n");
		buffer.append("		items : [{																		").append("\r\n");
//		buffer.append("     	columnWidth: .25,															").append("\r\n");
//		buffer.append("      	split: true,																").append("\r\n");
		buffer.append("      	collapsible: true,															").append("\r\n");
		buffer.append("      	region: 'west',																").append("\r\n");
		buffer.append("			height : Ext.getCmp('"+winid+"').getInnerHeight(),							").append("\r\n");
		buffer.append("			width : 210,																").append("\r\n");
//		buffer.append("     	title: 'wuxiaoxu',															").append("\r\n");
		buffer.append(" 		layout:'fit',																").append("\r\n");
		buffer.append(" 		id : '"+winid+"TreePanel',													").append("\r\n");
		buffer.append(" 	 	items:[Ext.getCmp('"+winid+"TestTree')]										").append("\r\n");
		buffer.append("   	},{																				").append("\r\n");
		buffer.append("      	region: 'center',															").append("\r\n");
//		buffer.append("     	columnWidth: .75,															").append("\r\n");
		buffer.append("     	split: true,																").append("\r\n");
		buffer.append("			height : Ext.getCmp('"+winid+"').getInnerHeight(),							").append("\r\n");
		buffer.append("			width : Ext.getCmp('"+winid+"').getInnerWidth()-210,						").append("\r\n");
//		buffer.append("     	collapsible: true,															").append("\r\n");
//		buffer.append("     	title: 'South',																").append("\r\n");
		buffer.append("     	forceFit:true,																").append("\r\n");
		buffer.append(" 		layout:'anchor',															").append("\r\n");
		buffer.append(" 		id : '"+winid+"GridFormPanel',												").append("\r\n");
		buffer.append(" 		items : [Ext.getCmp('"+winid+"nothfrom'), Ext.getCmp('"+winid+"EditGrid')]	").append("\r\n");
		buffer.append("   	}]																				").append("\r\n");
		buffer.append("});																					").append("\r\n");
		buffer.append("Ext.getCmp('"+winid+"MainPanel').doLayout(true);										").append("\r\n");
	}
	

	public void resize(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		buffer.append("Ext.getCmp('"+winid+"').on('resize', function(pw,w,h) {							").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"MainPanel').setWidth(pw.getInnerWidth());				").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"MainPanel').setHeight(pw.getInnerHeight());			").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"TreePanel').setHeight(pw.getInnerHeight());			").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"TreePanel').setWidth(210);								").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"GridFormPanel').setHeight(pw.getInnerHeight());		").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"GridFormPanel').setWidth(pw.getInnerWidth() - 210);	").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"EditGrid').setHeight(pw.getInnerHeight());				").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"EditGrid').setWidth(pw.getInnerWidth() - 210);			").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"MainPanel').doLayout(true);							").append("\r\n");
		buffer.append("	});																				").append("\r\n");
	}
	

	public void close(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		buffer.append("Ext.getCmp('"+winid+"').on('close', function() {						").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"TestTree')){							").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"TestTree').destroy();					").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"TreePanel')){							").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"TreePanel').destroy();					").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"nothfrom')){							").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"nothfrom').destroy();					").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"EditGrid')){							").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"EditGrid').destroy();					").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"GridFormPanel')){						").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"GridFormPanel').destroy();				").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"MainPanel')){							").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"MainPanel').destroy();					").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("		if(Ext.getCmp('"+winid+"')){									").append("\r\n");
		buffer.append("			Ext.getCmp('"+winid+"').destroy();							").append("\r\n");
		buffer.append("		}																").append("\r\n");
		buffer.append("	});																	").append("\r\n");
		buffer.append("	Ext.getCmp('"+winid+"').doLayout(true);								").append("\r\n");
		buffer.append("	Ext.getCmp('"+winid+"MainPanel').doLayout(true);					").append("\r\n");
	}
	
	
	 public int doEndTag() throws JspException {
    	release();
    	return EVAL_PAGE;
	 }
	 
	 
	 public void release(){
		super.release();
	 }

}
