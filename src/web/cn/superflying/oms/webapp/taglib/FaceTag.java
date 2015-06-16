package cn.superflying.oms.webapp.taglib;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.superflying.cn.driver.bean.sys.Preference;
import com.superflying.cn.driver.bean.sys.SysMenu;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

public class FaceTag extends BaseTag {
	
	private static final long serialVersionUID = 1L;
	
	private Map<String,SysMenu> nameToMenuMap = null;//所有系统菜单
	
	private List<SysMenu> userMenu = null;//当前用户拥有的 功能菜单
	
	private List<SysMenu> userAllMenu = null;//当前用户拥有的 菜单 和 所有的父菜单
	
	private List<SysMenu> rootMenu = null;//当前用户拥有根 菜单
	
	private User user = null;
	
	//初始化当前用户的菜单
	@SuppressWarnings("unchecked")
	private void init(){
		user = WEBUtil.getCurrentSysUser();
//		只拿出 父菜单 不拿 功能菜单
		this.nameToMenuMap = (Map<String, SysMenu>) WEBUtil.getServletContext().getAttribute("allMenu");
		if(null == this.nameToMenuMap){
			this.nameToMenuMap = DaoUtil.getSysMenuDao().getAllMenu();
			WEBUtil.getServletContext().setAttribute("allMenu",this.nameToMenuMap);
		}
		this.userMenu = DaoUtil.getSysMenuDao().getUserMenu(user.getId());		
		this.getUserAllMenu();
		this.getRootMenu();
	}
	
	/**
	 * @author wuxiaoxu 
	 * 获取当前用户所拥有菜单的父菜单及子菜单
	 */
	private void getUserAllMenu(){
		this.userAllMenu = new ArrayList<SysMenu>();
		if(null != this.userMenu){
			for(SysMenu menu : this.userMenu){
				this.getOneMenuAllParentMenu(menu);
			}
			this.userAllMenu.addAll(userMenu);//加入有真实功能
		}
	}
	
	/**
	 * @author wuxiaoxu 
	 * 获取当前用户的所菜单的父菜
	 */
	private void getOneMenuAllParentMenu(SysMenu menu){
		if(CommonUtil.isNotEmpty(menu.getParentName())){
			SysMenu parentMenu = this.nameToMenuMap.get(menu.getParentName());
			if(null != parentMenu && !this.userAllMenu.contains(parentMenu) ){
				this.userAllMenu.add(parentMenu);
				this.getOneMenuAllParentMenu(parentMenu);
			}else{
				return;
			}
		}else{
			return;
		}
	}
	
	/**
	 * @author wuxiaoxu 20120805 
	 * 获取当前用户的跟节点菜单
	 */
	private void getRootMenu(){
		this.rootMenu = new ArrayList<SysMenu>();
		for(SysMenu menu : userAllMenu){
			if(CommonUtil.isEmpty(menu.getParentName())){
				if(!this.rootMenu.contains(menu)){
					this.rootMenu.add(menu);
				}
			}
		}
	}
	
	public int doStartTag(){
		this.init();
		StringBuffer buffer = new StringBuffer();
		buffer.append("<script type='text/javascript'> 																	").append("\r\n");
		//wuxiaoxu 20120805 add 初始化菜单 主题及样式设置 完成
		buffer.append("MyDesktop = new Ext.app.App({																	").append("\r\n");
		buffer.append("	init : function() {																				").append("\r\n");
		buffer.append("		Ext.QuickTips.init();																		").append("\r\n");
		buffer.append("	},																								").append("\r\n");
		buffer.append("	getStyles : function() {																		").append("\r\n");
		buffer.append("		return "+this.getUserPreferences()+";														").append("\r\n");
		buffer.append("	},																								").append("\r\n");
		
		//wuxiaoxu 20120805 add 拿到它所有的父
		buffer.append("	getModules : function() {																		").append("\r\n");
//		buffer.append("		return ["+this.getRootMenuJs()+"];															").append("\r\n");
		buffer.append("		return ["+this.getRootMenuJs()+" new MyDesktop.Instructions()];								").append("\r\n");
		buffer.append("	},																								").append("\r\n");
		
		buffer.append("	getLaunchers : function() {																		").append("\r\n");
		buffer.append("		return {																					").append("\r\n");
//		buffer.append("			shortcut : [{id : 'UserMenu-shortcut',text : '编辑用户信息'								").append("\r\n");
//		buffer.append("						},{	id : 'MyTools-shortcut',text : '测试'}]									").append("\r\n");
		buffer.append("			shortcut : [" + this.getShortcut() + "]													").append("\r\n");
		buffer.append("		}																							").append("\r\n");
		buffer.append("	},																								").append("\r\n");
		
		
		buffer.append("	getStartConfig : function() {																	").append("\r\n");
		buffer.append("		return {																					").append("\r\n");
		buffer.append("			title : '<span  style=\"color:#FF0000\">当前用户："+ this.user.getNameCh() +"</span>',	").append("\r\n");
		buffer.append("			iconCls : 'user',																		").append("\r\n");
		buffer.append("			toolItems : [{																		 	").append("\r\n");
		buffer.append("						text : '设置',																").append("\r\n");
		buffer.append("						iconCls : 'pref-icon',														").append("\r\n");
		buffer.append("						handler : function() {														").append("\r\n");
		buffer.append("							var pre = new Ext.util.QoPreferences();									").append("\r\n");
		buffer.append("							pre.createWindow(this);													").append("\r\n");
		buffer.append("						},																			").append("\r\n");
		buffer.append("						scope : this																").append("\r\n");
		buffer.append("					}, '-', {																		").append("\r\n");
		buffer.append("						text : '注销',																").append("\r\n");
		buffer.append("						iconCls : 'logout',															").append("\r\n");
		buffer.append("						handler : function() {														").append("\r\n");
		buffer.append("   						Ext.MessageBox.confirm('消息', '确认系统注销？', function(bt){				").append("\r\n");
		buffer.append(" 							if (bt == 'yes') {													").append("\r\n");
		buffer.append("     							Ext.Ajax.request({												").append("\r\n");
		buffer.append("										url : 'logOutAction.do',									").append("\r\n");
		buffer.append("										params : {													").append("\r\n");
		buffer.append("											method : 'logout'										").append("\r\n");
		buffer.append("										},															").append("\r\n");
		buffer.append("										callback : function(options, success, response) {			").append("\r\n");
		buffer.append("		   									window.location='${ctx}/j_spring_security_logout';		").append("\r\n");
		buffer.append("										}															").append("\r\n");
		buffer.append("									});																").append("\r\n");
		buffer.append("								}																	").append("\r\n");
		buffer.append(" 						}, this);																").append("\r\n");
		buffer.append("						},																			").append("\r\n");
		buffer.append("						scope : this																").append("\r\n");
		buffer.append("					}]																				").append("\r\n");
		buffer.append("		};																							").append("\r\n");
		buffer.append("	}																								").append("\r\n");
		buffer.append("});																								").append("\r\n");
		
		buffer.append(this.getChildMenuJs(rootMenu).toString());
		buffer.append("</script> 																						").append("\r\n");
		this.writeBuffer(buffer);
		return EVAL_BODY_INCLUDE;
		
	}
	
	private int getChildSize(SysMenu meun){
		int i = 0;
		for(SysMenu m : userAllMenu){
			if(meun.getName().equals(m.getParentName())){
				i++;
			}
		}
		return i;
	}

	private String getChildMenuJs(List<SysMenu> rootMenu){
		StringBuffer buff = new StringBuffer();
		//wuxiaoxu 20120807 添加了系统说明
		buff.append("MyDesktop.Instructions = Ext.extend(Ext.app.Module, {													").append("\r\n");
		buff.append("	init : function() {																					").append("\r\n");
		buff.append("   	var thisModule= this;   																		").append("\r\n");
		buff.append("       this.launcher = {   																			").append("\r\n");
		buff.append("       	text : '系统说明',   																			").append("\r\n");
		buff.append("       	iconCls : 'Instructions',   																").append("\r\n");
		buff.append("       	handler : this.createWindow,   																").append("\r\n");
		buff.append("       	scope : this,   																			").append("\r\n");
		buff.append("       	windowId : 'instructions'  																	").append("\r\n");
//		buff.append("       	theHtml	:'"+menu.getMpage()+"'  															").append("\r\n");
		buff.append("		}   																							").append("\r\n");
		buff.append("	},   																								").append("\r\n");
		buff.append("	createWindow : function(src) {   																	").append("\r\n");		
		buff.append("		var desktop = this.app.getDesktop();   															").append("\r\n");
		buff.append("		var win = desktop.getWindow(src.windowId+'_win');   											").append("\r\n");
		buff.append("       var resizable = true;					   														").append("\r\n");
		buff.append("       if (!win) {   																					").append("\r\n");		
		buff.append("       	win = desktop.createWindow({   																").append("\r\n");
		buff.append("           	id : src.windowId+'_win',   															").append("\r\n");
		buff.append("           	title : src.text,   																	").append("\r\n");
		buff.append("           	width : 800,height :600,  																").append("\r\n");
		buff.append("           	autoScroll:true,																		").append("\r\n");
		buff.append("		 		resizable : resizable,																  	").append("\r\n");
		buff.append("           	iconCls : src.iconCls,   																").append("\r\n");
		buff.append("           	html : '<FONT style=FONT-SIZE:30pt>说明：本系统为武晓旭完成因未经过测试，可能隐含多个问题，望您能在使用过程中发现问题及时反馈 <br> 邮箱：wuxiaoxu666@126.com<br> qq:270939485</FONT>'  , ").append("\r\n"); 
		buff.append("           	shim : false,   																		").append("\r\n"); 
		buff.append("           	animCollapse : false,  														 			").append("\r\n");
		buff.append("            	constrainHeader : true  																").append("\r\n");
		buff.append("			});  														 								").append("\r\n");
		buff.append("		}   																							").append("\r\n");
		buff.append("      	win.show();   																					").append("\r\n");
		buff.append("	}  																									").append("\r\n");
		buff.append("});																									").append("\r\n");
		
		
		if(null != rootMenu && rootMenu.size() > 0){
			for (SysMenu menu : rootMenu) {
				buff.append("MyDesktop."+menu.getName()+" = Ext.extend(Ext.app.Module, {											").append("\r\n");
				buff.append("	init : function() {																					").append("\r\n");
				buff.append("   	var thisModule= this;   																		").append("\r\n");
				buff.append("       this.launcher = {   																			").append("\r\n");
				buff.append("       	text : '"+menu.getTitle()+"',   															").append("\r\n");
				buff.append("       	iconCls : '"+menu.getName()+"',   															").append("\r\n");
				if(this.getChildSize(menu)>0){//如果他的有子菜单
					buff.append("       handler : function() {  return false; },													").append("\r\n");
					buff.append(this.getChildChildMenuJs(menu));
				}else{
					buff.append("       handler : this.createWindow,   																").append("\r\n");
					buff.append("       scope : this,   																			").append("\r\n");
					buff.append("       windowId : '"+menu.getName()+"',  															").append("\r\n");
					buff.append("       theHtml	:'"+menu.getMpage()+"'  															").append("\r\n");
				}
				buff.append("		}   																							").append("\r\n");
				buff.append("	},   																								").append("\r\n");
				buff.append("	createWindow : function(src) {   																	").append("\r\n");		
				buff.append("		var desktop = this.app.getDesktop();   															").append("\r\n");
				buff.append("		var win = desktop.getWindow(src.windowId+'_win');   											").append("\r\n");
				
				
				buff.append("       var resizable = true;					   														").append("\r\n");
				//最大化按钮控制
				buff.append("       var maximizable = true;					   														").append("\r\n");
				//wuxiaoxu 20120811 当为发送电子邮件时不让其改变窗口
				buff.append("		if (src.windowId == 'emailManage') {		  													").append("\r\n");
				buff.append("       	resizable = false;					  														").append("\r\n");
				buff.append("       	maximizable = false;					  													").append("\r\n");
				buff.append("		}										   														").append("\r\n");
				
				buff.append("       if (!win) {   																					").append("\r\n");		
				buff.append("       	win = desktop.createWindow({   																").append("\r\n");
				buff.append("           	id : src.windowId+'_win',   															").append("\r\n");
				buff.append("           	title : src.text,   																	").append("\r\n");
				buff.append("           	width : !src.width?800:(src.width==5000?Ext.get('x-desktop').getRight():src.width),		").append("\r\n");
				buff.append("           	height :!src.height?600:(src.height==5000?Ext.get('x-desktop').getBottom():src.height), ").append("\r\n");
				buff.append("           	autoLoad:{url:src.theHtml+((src.theHtml).indexOf('?')>0?'&':'?')+'parentWinId='+src.windowId+'_win',nocache:true,scripts:true},").append("\r\n");
				buff.append("           	autoScroll:true,																		").append("\r\n");
				buff.append("		 		resizable : resizable,																  	").append("\r\n");
				buff.append("		 		maximizable: maximizable,															  	").append("\r\n");
				buff.append("           	iconCls : src.iconCls,   																").append("\r\n");
				buff.append("           	shim : false,   																		").append("\r\n"); 
				buff.append("           	animCollapse : false,  														 			").append("\r\n");
				buff.append("            	constrainHeader : true  																").append("\r\n");
				buff.append("			});  														 								").append("\r\n");
				buff.append("		}   																							").append("\r\n");
				buff.append("      	win.show();   																					").append("\r\n");
				buff.append("	}  																									").append("\r\n");
				buff.append("});																									").append("\r\n");
			}
		}
		return buff.toString();
	}
	
	/**
	 * @see 得到当前菜单的子菜单
	 * @param meun
	 * @return
	 */
	private List<SysMenu> getChildMenuList(SysMenu meun){
		List<SysMenu> list = new ArrayList<SysMenu>();
		for(SysMenu m : userAllMenu){
			if(meun.getName().equals(m.getParentName())){
				list.add(m);
			}
		}
		return list;
	}
	
	/**
	 * @see 获取菜单的子菜单
	 * @author wuxiaoxu 20120806
	 * @param menu
	 * @return
	 */
	private StringBuffer getChildChildMenuJs(SysMenu menu){
		StringBuffer sb = new StringBuffer();
		List<SysMenu> chlidc = this.getChildMenuList(menu);
		sb.append("		menu : {																					").append("\r\n");
		sb.append("     	listeners  :{																			").append("\r\n");
		sb.append("				'contextmenu' : {																	").append("\r\n");
		sb.append("					fn : function(m, e, t) {														").append("\r\n");
		sb.append("						e.stopEvent();																").append("\r\n");
		sb.append("						if (t.menu == null) {														").append("\r\n");
		sb.append("							if (Ext.getCmp('addToDesMenu')) {										").append("\r\n");
		sb.append("								Ext.getCmp('addToDesMenu').removeAll();								").append("\r\n");
		sb.append("								Ext.getCmp('addToDesMenu').destroy();								").append("\r\n");
		sb.append("							}																		").append("\r\n");
		sb.append("							var todes = new Ext.menu.Menu({											").append("\r\n");
		sb.append("								id : 'addToDesMenu',												").append("\r\n");
		sb.append("								items : [{															").append("\r\n");
		sb.append("									text : '发送到桌面快捷',											").append("\r\n");
		sb.append("									handler : function() {											").append("\r\n");
		sb.append("										Ext.Ajax.request({											").append("\r\n");
		sb.append("											url : '/desktop/addShortcut',							").append("\r\n");
		sb.append("											params : {												").append("\r\n");
		sb.append("												menuName : t.id										").append("\r\n");
		sb.append("											},														").append("\r\n");
		sb.append("											success : function() {									").append("\r\n");
		sb.append("												thisModule.app.initShortcut([{						").append("\r\n");
		sb.append("													id : t.id + '-shortcut',						").append("\r\n");
		sb.append("													text : t.text									").append("\r\n");
		sb.append("												}]);												").append("\r\n");
		sb.append("											}														").append("\r\n");
		sb.append("										});															").append("\r\n");
		sb.append("									}																").append("\r\n");
		sb.append("								}]																	").append("\r\n");
		sb.append("							})																		").append("\r\n");
		sb.append("							e.preventDefault();														").append("\r\n");
		sb.append("							todes.showAt(e.getXY());												").append("\r\n");
		sb.append("						}																			").append("\r\n");
		sb.append("					}																				").append("\r\n");
		sb.append("				}																					").append("\r\n");
		sb.append("			}, 																						").append("\r\n");
		sb.append("         items : [																				").append("\r\n");
		for (SysMenu cmenu : chlidc) {
			sb.append("         {").append("\r\n");
			sb.append("           text : '"+cmenu.getTitle()+"' ,													").append("\r\n");
			sb.append("           iconCls : '"+cmenu.getName()+"', 													").append("\r\n");
			sb.append("           id : '"+cmenu.getName()+"',    													").append("\r\n");
			//wuxiaoxu 20130320 modify
			sb.append("           width:" + cmenu.getWidthWithOutNull()+",											").append("\r\n");
			sb.append("           height:"+ cmenu.getHeightWithOutNull() +",										").append("\r\n");
			
			sb.append("           scope : this,    																	").append("\r\n");
			if(this.getChildSize(cmenu)>0){
				sb.append("handler : function() {return false; },													").append("\r\n");
				sb.append(this.getChildChildMenuJs(cmenu));
			}else{ 
				sb.append("  handler : this.createWindow,															").append("\r\n");
				sb.append("  windowId : '"+cmenu.getName()+"',														").append("\r\n");
				sb.append("  width:"+cmenu.getWidth()+", 															").append("\r\n");
				sb.append("  height:"+cmenu.getHeight()+",															").append("\r\n");
				sb.append("  theHtml:'"+cmenu.getMpage()+"'															").append("\r\n");
			}
			sb.append("         },																					").append("\r\n");
		}
		sb.deleteCharAt(sb.lastIndexOf(","));//去除最后一个“,”		
		sb.append("   ]}																							").append("\r\n");
		return sb ; 
	}
	
	/**
	 * @author wuxiaoxu 20120806
	 * 获取用户的个人设置
	 * @return
	 */
	private String getUserPreferences() {
		Preference preference = DaoUtil.getUserDao().getUserNotLazyById(user.getId()).getPreference();
		StringBuffer buffer = new StringBuffer();
		if(preference == null){
			buffer.append("{																												").append("\r\n");
			buffer.append("		backgroundColor:'390A0A',																					").append("\r\n");
			buffer.append("		fontColor:'FFFFFF',     																					").append("\r\n");
			buffer.append("		transparency:'100',     																					").append("\r\n");
//			buffer.append("		wallpaperPosition:'tile',     																				").append("\r\n");
			buffer.append("		wallpaperPosition:'center',     																			").append("\r\n");
			buffer.append("		theme:{id:'4',name:'默认',pathFile:'/scripts/ext/desktop/css/desktop.css'},    								").append("\r\n");
			buffer.append("		wallpaper:{id:'8',name:'fiel(1280X800像素)',pathFile:'/scripts/ext/desktop/wallpapers/blue-psychedelic.jpg'}}").append("\r\n");
			return buffer.toString();
		}else{
			buffer.append("{											    																").append("\r\n");
			buffer.append("		backgroundColor		:	'"+(preference.getBackgroundColor())+"',	  										").append("\r\n");
			buffer.append("		fontColor			:	'"+(preference.getFontColor())+"',     												").append("\r\n");
			buffer.append("		transparency		:	'"+(preference.getTransparency())+"',    											").append("\r\n");
			buffer.append("		wallpaperPosition	:	'"+(preference.getWallpaperPosition())+"',   										").append("\r\n");
			buffer.append("		theme:{     																								").append("\r\n");
			// 通过键preferencesTheme获取到PreferencesTheme
			buffer.append("			id			:	'"+(preference.getTheme().getId())+"',     												").append("\r\n");
			buffer.append("			name		:	'"+(preference.getTheme().getName()) +"',     											").append("\r\n");
			buffer.append("			pathFile	:	'"+(preference.getTheme().getPathFile())+"'  											").append("\r\n");
			buffer.append("		},     																										").append("\r\n");
			// 通过键preferencesWallPaper获取到PreferencesWallPaper
			buffer.append("		wallpaper:{     																							").append("\r\n");
			buffer.append("			id			:	'"+(preference.getWallPaper().getId())+"',     											").append("\r\n");
			buffer.append("			name		:	'"+(preference.getWallPaper().getName())+"',  											").append("\r\n");
			buffer.append("			pathFile	:	'"+(preference.getWallPaper().getPathFile())+"'											").append("\r\n");
			buffer.append("		}																											").append("\r\n");
			buffer.append("}																												").append("\r\n");
			return buffer.toString();
		}
	}
	
	/**
	 * @author wuxiaoxu 20120805
	 * 获取用户所有菜单的根菜单
	 * @return
	 */
	private String getRootMenuJs() {
		if(null == this.rootMenu || this.rootMenu.size() == 0)	return "";
		
		StringBuffer buffer = new StringBuffer();
		for(SysMenu menu : this.rootMenu){
			buffer.append(" new MyDesktop."+ menu.getName().trim() +"(),");
		}
//		wuxiaoxu 20120807 
//		因添加了 说明项所以不用再去掉“,”
//		if(buffer.length() > 0){//去除最后的“,”
//			buffer.deleteCharAt(buffer.length() - 1);
//		}
		return buffer.toString();		
	}
	
	/**
	 * @author wuxiaoxu 20120806
	 * 获取用户所有桌面上显示的菜单
	 * @return
	 */
	private String getShortcut() {
		long userId = user.getId();
		List<SysMenu> list = DaoUtil.getSysMenuDao().getUserDesktopMenu(userId);
		if(CommonUtil.isEmpty(list))return "";			
			
		StringBuffer buffer = new StringBuffer();
		for(SysMenu menu : list){
			buffer.append("	{													").append("\r\n");
			buffer.append("		id : '"+ menu.getName() +"-shortcut',			").append("\r\n");
			buffer.append("		text : '"+ menu.getTitle() +"'					").append("\r\n");
			buffer.append("	},													").append("\r\n");
		}
		if(buffer.lastIndexOf(",") > 0){//去除最后的“,”
			buffer.deleteCharAt(buffer.lastIndexOf(","));
		}
		return buffer.toString();		
	}
	
	public int doEndTag(){
    	release();
    	return EVAL_PAGE;
	}
 
	 public void release(){
			super.release();//释放资源
	 }
	
}
