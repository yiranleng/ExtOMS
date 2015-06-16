package cn.superflying.oms.webapp.taglib;
/**
 * author wuxiaoxu  20100306
 * 此类是为分页添加一个可自行选值的下拉框
 * 
 */
public class AddPagingToolBarComboBox {
	/**
	 * 
	 * @param comboboxId combobox对象的id
	 * @param dataLoad 数据加载
	 * @param pagingToolbar pagingtoolbar 对象
	 * @return String 
	 */
	public String addComboBox( String comboboxId,String dataLoad,String pagingToolbar,String methodName){
//		wuxiaoxu  add    20100306
		String buffer="";
		buffer="new Ext.form.ComboBox({	";	
		buffer+="id:'"+comboboxId+"',";	
		buffer+="triggerAction:'all',";	  //单击触发按钮显示全部数据
		buffer+="store:new Ext.data.SimpleStore({";	
		buffer+="fields:['value','display'],";	 //注意：这里定义的键值必须与下面的属性(displayField:valueField)对应
		buffer+="data:[[10,10], [20,20],[50,50],[100,100]]}),  ";	//数据源
		buffer+="displayField:'display',";	  //定义显示的字段		
		buffer+="width:45,";	
//		buffer+="		pid:this.id,";	
		buffer+="mode:'local',";	  //本地模式  远程:remote						  
		buffer+="typeAhead:true,";	  //允许自动选择匹配的剩余部分文本
		buffer+="value:'20', ";	//默认选择值
		buffer+="valueField:'value',";	  //定义字段值
//		buffer+="readOnly:true,";//3.4不可用
		buffer+="forceSelection:true,";	//要求输入的值必须在列表中存在
		buffer+="listeners:{select :function (){Ext.getCmp('"+pagingToolbar+"').pageSize="+methodName+"();"+dataLoad+"; }}";	
		buffer+="});";		
		buffer+="function "+methodName+"(){var comboValue=Ext.getCmp('"+comboboxId+"').value; return comboValue==10?10:comboValue==20?20:comboValue==50?50:100;}";
//end  wuxiaoxu   20100306	
		return buffer;
	}
	
	/**
	 * @author wuxiaoxu 20111018 删除处理函数
	 * @param buffer
	 */
	public static void combox(StringBuffer buffer,String winid){
		buffer.append(" function "+winid+"getComboValue(){                                                          ").append("\r\n");
		buffer.append(" 	var comboValue=Ext.getCmp('"+winid+"ComboBox_id').value;                        		").append("\r\n");
		buffer.append("    	return comboValue==10?10:comboValue==20?20:comboValue==50?50:100;                       ").append("\r\n");
		buffer.append(" };                                                                     						").append("\r\n");
		//combobox
		buffer.append(" new Ext.form.ComboBox({                                                                     ").append("\r\n");
		buffer.append("     id:'"+winid+"ComboBox_id',                                                     			").append("\r\n");
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
		buffer.append("         	Ext.getCmp('"+winid+"bbar').pageSize="+winid+"getComboValue();                	").append("\r\n");
//		buffer.append("         	Ext.getCmp('"+winid+"grid').getStore().load({params : {start : 0,limit : getComboValue()}}); ").append("\r\n");
		buffer.append("         	Ext.getCmp('"+winid+"').getStore().load({params : {start : 0,limit : "+winid+"getComboValue()}}); ").append("\r\n");
		buffer.append("       	}                                                                 					").append("\r\n");
		buffer.append("     }                                                                   					").append("\r\n");
		buffer.append(" });                                                                      					").append("\r\n");
	}
}
