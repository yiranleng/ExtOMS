package cn.superflying.oms.webapp.taglib.test;

import javax.servlet.jsp.JspException;

import cn.superflying.oms.webapp.taglib.BaseTag;

public class TestTreeTag extends BaseTag {
	
	private static final String URL = "/testTree";

	private static final long serialVersionUID = 1L;
	
	public int doStartTag() throws JspException {
		
		StringBuffer buffer = new StringBuffer();
		buffer.append("<script type='text/javascript'>").append("\r\n");
		treePanel(buffer);
		buffer.append("</script>");
		this.writeBuffer(buffer);
		return EVAL_BODY_INCLUDE;
	}
	/**
	 * @author wuxiaoxu 20111124 动态树
	 * @param buffer
	 */
	public void treePanel(StringBuffer buffer){
		String winid = pageContext.getRequest().getParameter("parentWinId");
		
		buffer.append("var	"+winid+"TestTree = new Ext.tree.TreePanel({ 						").append("\r\n");
		buffer.append("		id:'"+winid+"TestTree',											 	").append("\r\n");
//		buffer.append("		el : 'DrugTreeTagDiv', 												").append("\r\n");
//		buffer.append("		split:true, 														").append("\r\n");
		buffer.append("	    autoScroll:true,													").append("\r\n");
		buffer.append("	    animate:true, 														").append("\r\n");
		buffer.append("	    enableDD:false, 													").append("\r\n");
//		buffer.append("		collapsible:true, 													").append("\r\n");
		buffer.append("	    height : Ext.getCmp('"+winid+"').getInnerHeight(),					").append("\r\n");
//		buffer.append("	    height : 500, 														").append("\r\n");
//		buffer.append("	    width : 165, 														").append("\r\n");
//		buffer.append("	    containerScroll: true, 												").append("\r\n");
		buffer.append("	    loader: new Ext.tree.TreeLoader({ 									").append("\r\n");
		buffer.append("	    	dataUrl:'' 														").append("\r\n");
//		buffer.append("	    	dataUrl:'' 														").append("\r\n");
		buffer.append("		}) 																	").append("\r\n");
		buffer.append("}); 																		").append("\r\n");

		buffer.append("var "+winid+"node_root = new Ext.tree.AsyncTreeNode({ 					").append("\r\n");
		buffer.append("		text: '合力忆捷', 													").append("\r\n");
		buffer.append("		draggable:false, 													").append("\r\n");
		buffer.append("		id:'rootNode' 														").append("\r\n");
		buffer.append("}); 																		").append("\r\n");
		
		//加载树节点
		buffer.append(winid+"TestTree.setRootNode("+winid+"node_root); 							").append("\r\n");
		buffer.append(winid+"TestTree.on('beforeload', function(node){							").append("\r\n");
		buffer.append("	var parentId = node.attributes.id;          							").append("\r\n");
		buffer.append("	parentId = parentId=='rootNode' ?'' : 'rootNode';       				").append("\r\n");
		buffer.append(	winid+"TestTree.loader.dataUrl = '"+ URL +"/getChild?parentId='+parentId;").append("\r\n");
//		buffer.append(	winid+"TestTree.loader.dataUrl = '"+ URL +"/getChild';					").append("\r\n");//传null
		buffer.append("}); 																		").append("\r\n");

		//--作用 在每次展开节点在合上 都重新发送请求一次
		buffer.append(""+winid+"TestTree.on('expandnode', function(node, e){ 					").append("\r\n");
		buffer.append("		node.loaded=false; 													").append("\r\n");
		buffer.append("}); 																		").append("\r\n");

		buffer.append(""+winid+"TestTree.on('click', function(node, e){    						").append("\r\n");
		buffer.append("		try{ 																").append("\r\n");
		buffer.append("			try{ 															").append("\r\n");
		buffer.append("				Ext.Ajax.request({ 											").append("\r\n");
		buffer.append("  				url:'"+ URL +"/getNodeList',		 					").append("\r\n");		
		buffer.append("  				params:{id : node.id}									").append("\r\n");
		buffer.append("  			}); 														").append("\r\n");
		buffer.append("			}catch(ex){} 													").append("\r\n");
		buffer.append("		}catch(e){}; 														").append("\r\n");
		buffer.append("}); 																		").append("\r\n");
			   
		//如果在后面的地方已经渲染这棵树 就不能使用此属性，他会因找不到渲染的地方而报错
//		buffer.append( ""+winid+"TestTree.render(); 											").append("\r\n");
		buffer.append( ""+winid+"node_root.expand(); 											").append("\r\n");
//		buffer.append("Ext.getCmp('"+winid+"').doLayout(); 										").append("\r\n");
		buffer.append("Ext.getCmp('"+winid+"').on('resize', function(pw,w,h) { 					").append("\r\n");
//		buffer.append("		Ext.getCmp('"+winid+"TestTree').setHeight(h*0.6-28.2); 				").append("\r\n");
		buffer.append("		Ext.getCmp('"+winid+"TestTree').setHeight(h);		 				").append("\r\n");
		buffer.append("}); 																		").append("\r\n");
	}
	
	 public int doEndTag() throws JspException {
    	release();
    	return EVAL_PAGE;
	 }
	 public void release(){
		super.release();
	 }

}
