package cn.superflying.oms.webapp.taglib.function;

import javax.servlet.jsp.JspException;

import cn.superflying.oms.webapp.taglib.BaseTag;

public class EmailHomeTag extends BaseTag {
	
	private static final String URL = "/email";

	private static final long serialVersionUID = 1L;
	
	public int doStartTag() throws JspException {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<script type='text/javascript'>\r\n");
		getEmailPanel(buffer);
		buffer.append("</script>").append("\r\n");
		buffer.append("<div id='EmailTagDiv'/>").append("\r\n");
		this.writeBuffer(buffer);
		return EVAL_BODY_INCLUDE;
	}

	/**
	 * @see 发送邮件
	 * @author wuxiaoxu 20130801
	 * @param buffer
	 */
	public void getEmailPanel(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
//		buffer.append(" Ext.getCmp('"+winid+"').on('resize', function(pw,w,h) {   		 			").append("\r\n");
//		buffer.append("      Ext.getCmp('"+winid+"Form').setHeight(pw.getInnerHeight());      		").append("\r\n");
//		buffer.append("      Ext.getCmp('"+winid+"Form').setWidth(pw.getInnerWidth());          	").append("\r\n");
//		buffer.append("  });                                                              	    	").append("\r\n");
		
		buffer.append("		function send"+winid+"data(){											").append("\r\n");
		buffer.append("   		Ext.getCmp('"+winid+"Form').form.doAction('submit',{				").append("\r\n");
		buffer.append("         	url:'"+URL+"/sendEmail',										").append("\r\n") ;
		buffer.append("             method:'post',													").append("\r\n") ;
		buffer.append("             timeout:100000,													").append("\r\n") ;
		buffer.append("             success:function(form,action){ 									").append("\r\n") ;              
		buffer.append("         		var json = Ext.util.JSON.decode(action.response.responseText);").append("\r\n");
		buffer.append("         		if(json.success =='true'){									").append("\r\n");
		buffer.append("                	 		Ext.Msg.alert('消息',json.msg);    					").append("\r\n") ;
		buffer.append("							Ext.getCmp('"+winid+"').close();					").append("\r\n") ;
		buffer.append("         		}else{														").append("\r\n");
		buffer.append("             		Ext.Msg.alert('消息',json.msg);							").append("\r\n") ;
		buffer.append("         		}															").append("\r\n");
		buffer.append("         		Ext.getCmp('"+winid+"SendButton').setDisabled(false);		").append("\r\n");
		buffer.append("             },																").append("\r\n") ;
		buffer.append("             failure:function() {											").append("\r\n") ;
		buffer.append("             	Ext.Msg.alert('消息','邮件发送失败！');							").append("\r\n") ;
		buffer.append("         		Ext.getCmp('"+winid+"SendButton').setDisabled(false);		").append("\r\n");
		buffer.append("             }																").append("\r\n") ;
		buffer.append("         })																	").append("\r\n");
		buffer.append("    }																		").append("\r\n");
		
		buffer.append("new Ext.form.FormPanel({														").append("\r\n");
	    buffer.append("		labelAlign 	: 'left',													").append("\r\n");
	    buffer.append("		labelWidth 	: 40,														").append("\r\n");
	    buffer.append("   	frame		: true,														").append("\r\n");
	    buffer.append("   	id			: '"+winid+"Form',											").append("\r\n");
	    buffer.append("   	renderTo	:'EmailTagDiv',												").append("\r\n");
	    buffer.append("   	heigth		: Ext.getCmp('"+winid+"').getInnerHeight(),					").append("\r\n");
	    buffer.append("   	width		: Ext.getCmp('"+winid+"').getInnerWidth(),					").append("\r\n");
//	    buffer.append("   	foriceFit: true,														").append("\r\n");
	    buffer.append("   	align: 'stretch',														").append("\r\n");
	    buffer.append("     columnWidth:.5,															").append("\r\n");
	    buffer.append("     	items: [{															").append("\r\n");
	    buffer.append("         	xtype:'textfield',												").append("\r\n");
	    buffer.append("             fieldLabel: 'email',											").append("\r\n");
	    buffer.append("             name: 'email',													").append("\r\n");
	    buffer.append("             vtype:'email',													").append("\r\n");
	    buffer.append("             allowBlank:false,												").append("\r\n");
	    buffer.append("   			width: Ext.getCmp('"+winid+"').width-80,						").append("\r\n");
	    buffer.append("             blankText:'不允许为空！'											").append("\r\n");
	    buffer.append("         },{																	").append("\r\n");
	    buffer.append("          	xtype:'textfield',												").append("\r\n");
	    buffer.append("   			width: Ext.getCmp('"+winid+"').width-80,						").append("\r\n");
	    buffer.append("             fieldLabel: '主题',												").append("\r\n");
	    buffer.append("             name: 'subject',												").append("\r\n");
	    buffer.append("             allowBlank:false,												").append("\r\n");
	    buffer.append("             blankText:'不允许为空！'											").append("\r\n");
	    buffer.append("      	},{																	").append("\r\n");
	    buffer.append("        		xtype:'htmleditor',												").append("\r\n");
//	    buffer.append("        		xtype:'textarea',												").append("\r\n");
	    buffer.append("   			width: Ext.getCmp('"+winid+"').width-30,						").append("\r\n");
	    buffer.append("        		id:'content',													").append("\r\n");
	    buffer.append("        		fieldLabel:' 内容',												").append("\r\n");
	    buffer.append("       		hideLabel: true,												").append("\r\n");
	    buffer.append("       		height:200,														").append("\r\n");
	    buffer.append("             allowBlank:false,												").append("\r\n");
	    buffer.append("             blankText:'不允许为空！'											").append("\r\n");
	    buffer.append("    		}],																	").append("\r\n");

	    buffer.append("    buttonAlign:'center',													").append("\r\n");
	    buffer.append("    buttons: [{																").append("\r\n");
	    buffer.append("         text: '发送'	,														").append("\r\n");
	    buffer.append("         id: '"+winid+"SendButton'	,										").append("\r\n");
		buffer.append(" 		handler : function(){												").append("\r\n");
		buffer.append(" 				var form = Ext.getCmp('"+winid+"Form').getForm()			").append("\r\n");
		buffer.append(" 					if(form.isValid()){										").append("\r\n");
		buffer.append(" 						Ext.getCmp('"+winid+"SendButton').setDisabled(true);").append("\r\n");
		buffer.append(" 						send"+winid+"data();								").append("\r\n");
		buffer.append(" 					}else{													").append("\r\n");
		buffer.append(" 						return false;										").append("\r\n");
		buffer.append(" 					}														").append("\r\n");
		buffer.append(" 				}															").append("\r\n");
	    
	    buffer.append("    },{																		").append("\r\n");
	    buffer.append("        text: '重置',															").append("\r\n");
	    buffer.append("        handler:function(){Ext.getCmp('"+winid+"Form').getForm().reset();}	").append("\r\n");
	    buffer.append("    },{   																	").append("\r\n");
	    buffer.append("        text: '关闭',															").append("\r\n");
	    buffer.append("        handler:function(){Ext.getCmp('"+winid+"').close();}					").append("\r\n");
	    buffer.append("    }]																		").append("\r\n");
	    buffer.append("});																			").append("\r\n");
	}
	
	 public int doEndTag() throws JspException {
    	release();
    	return EVAL_PAGE;
	 }
	 public void release(){
		super.release();
	 }

}
