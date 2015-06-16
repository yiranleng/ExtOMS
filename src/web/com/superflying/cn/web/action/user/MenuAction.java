package com.superflying.cn.web.action.user;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fins.org.json.JSONArray;
import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.bean.sys.SysMenu;
import com.superflying.cn.driver.bean.sys.UserMenu;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

@Controller
@RequestMapping("menu")
public class MenuAction {
	
	/**
	 * @see 用户拥有的所有功能菜单
	 */
	@RequestMapping("userMenus")
	public void userFunctions(Long userId,HttpServletResponse response){
		List<SysMenu> list = DaoUtil.getSysMenuDao().getUserMenu(userId);
		JSONArray ary = new JSONArray();
		for(SysMenu menu : list){
			JSONObject json = new JSONObject();
			json.put("code", menu.getName());
			json.put("desc", menu.getTitle());
			ary.put(json);
		}	
		JSONObject json = new JSONObject();
		json.put("totalProperty", list.size());
		json.put("dataList", ary);
		WEBUtil.writeJson(response, json.toString());
	}
	
	/**
	 * @see 用户没有的功能
	 */
	@RequestMapping("otherMenus")
	public void otherFunctions(Long userId,HttpServletResponse response){
		List<SysMenu> list = DaoUtil.getSysMenuDao().getOtherMenu(userId);
		JSONArray ary = new JSONArray();
		for(SysMenu menu : list){
			JSONObject json = new JSONObject();
			json.put("code", menu.getName());
			json.put("desc", menu.getTitle());
			ary.put(json);
		}	
		JSONObject json = new JSONObject();
		json.put("totalProperty", list.size());
		json.put("dataList", ary);
		WEBUtil.writeJson(response, json.toString());
	}
	
	/**
	 * 功能分配
	 * @param userId
	 * @param response
	 */
	@RequestMapping("saveMenus")
	public void saveMenus(Long userId,String value,HttpServletResponse response){
		JSONObject json = new JSONObject();	
		String[] names = null;
		if(StringUtils.isNotBlank(value)){//wuxiaoxu 20111217 修复了系统中因功能全部从用户撤销而导致的 function不为空问题
			names = value.split(",");
		}
		if(null != userId){
			DaoUtil.getUserMenuDao().deleteByUserIdMenuName(userId , names);
			if(null != names && names.length > 0){
				List<String> list = DaoUtil.getUserMenuDao().findByUserID(userId);
				for(String name : names){
					if(StringUtils.isNotBlank(name) && !list.contains(name)){
						DaoUtil.getUserMenuDao().save(UserMenu.createInstance(userId, name));
					}
				}
			}
			json.put("success", "true");
			json.put("msg", "功能授权成功!");	
		}else{
			json.put("success", "false");
			json.put("msg", "功能授权失败!");
		}
		WEBUtil.writeJson(response, json.toString());
	}
}
