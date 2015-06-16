package com.superflying.cn.web.action.desktop;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fins.org.json.JSONArray;
import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.bean.sys.Preference;
import com.superflying.cn.driver.bean.sys.Theme;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.driver.bean.sys.UserMenu;
import com.superflying.cn.driver.bean.sys.WallPaper;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

/**
 * @author wuxiaoxu 20130722
 * @see 桌面处理器
 */
@Controller
@RequestMapping("desktop")
public class DesktopAction {

	/**
	 * @see 获取所有主题
	 * @param response
	 */
	@RequestMapping("getThemes")
	public void getThemes(HttpServletResponse response){
		List<Theme> list = DaoUtil.getThemeDao().find();
		JSONArray array = new JSONArray();
		if(CommonUtil.isNotEmpty(list)){
			for(Theme t : list){
				array.put(t.toJson());
			}
		}
		JSONObject json = new JSONObject();
		json.put("images", array);
		WEBUtil.writeJson(response, json.toString()) ;
	}
	
	/**
	 * @see 加载所有壁纸
	 * @param response
	 */
	@RequestMapping("getWallpapers")
	public void getWallpapers(HttpServletResponse response){
		List<WallPaper> list = DaoUtil.getWallPaperDao().find();
		JSONArray array = new JSONArray();
		if(CommonUtil.isNotEmpty(list)){
			for(WallPaper t : list){
				array.put(t.toJson());
			}
		}
		JSONObject json = new JSONObject();
		json.put("images", array);
		WEBUtil.writeJson(response, json.toString()) ;
	}
	
	/**
	 * @author wuxiaoxu 20130722 add
	 * @param request
	 * @param response
	 */
	@RequestMapping("savePreferences")
	public void savePreferences(Preference preference,
			@RequestParam(required = false)
			Long themeId, @RequestParam(required = false)
			Long wallpaperId, HttpServletResponse response){
		
		Theme theme = null;
		WallPaper wallPaper = null;
		if(null != themeId){
			theme = DaoUtil.getThemeDao().get(themeId);
			preference.setTheme(theme);
		}
		if(null != wallpaperId){
			wallPaper = DaoUtil.getWallPaperDao().get(wallpaperId);
			preference.setWallPaper(wallPaper);
		}
		
		User user = DaoUtil.getUserDao().get(WEBUtil.getCurrentSysUser().getId());
		
		Preference preference2 = user.getPreference();
		//preference2.getId();
		if(null == preference2){
			DaoUtil.getPreferencesDao().save(preference);
			user.setPreference(preference);
			DaoUtil.getUserDao().update(user);
		}else{
			preference2.setBackgroundColor(preference.getBackgroundColor());
			preference2.setFontColor(preference.getFontColor());
			preference2.setTransparency(preference.getTransparency());
			if(null != preference.getTheme()){
				preference2.setTheme(preference.getTheme());
			}
			if(null != preference.getWallPaper()){
				preference2.setWallPaper(preference.getWallPaper());
			}
			preference2.setWallpaperPosition(preference.getWallpaperPosition());
			DaoUtil.getPreferencesDao().update(preference2);
			//user.setPreference(preference2);
			//DaoUtil.getUserDao().update(user);
		}
		JSONObject object = new JSONObject();
		object.put("success",true);
		WEBUtil.writeJson(response, object.toString());
	}
	
	/**
	 * @see 删除桌面快捷方式
	 * @param menuName
	 * @param response
	 */
	@RequestMapping("deleteShortcut")
	public void deleteShortcut(String menuName, HttpServletResponse response){
		User user = WEBUtil.getCurrentSysUser();
		UserMenu userMenu = DaoUtil.getUserMenuDao().findByUserIdMenuName(user.getId(),menuName);
		if(null != userMenu){
			userMenu.setDesktopShow(null);
			DaoUtil.getUserMenuDao().update(userMenu);
		}
		JSONObject object = new JSONObject();
		object.put("success",true);
		WEBUtil.writeJson(response, object.toString());
	}
	
	/**
	 * @see 发送图标到桌面
	 * @param menuName
	 * @param response
	 */
	@RequestMapping("addShortcut")
	public void addShortcut(String menuName, HttpServletResponse response){
		User user = WEBUtil.getCurrentSysUser();
		UserMenu userMenu = DaoUtil.getUserMenuDao().findByUserIdMenuName(user.getId(),menuName);
		if(null != userMenu){
			userMenu.setDesktopShow("1");
			DaoUtil.getUserMenuDao().update(userMenu);
		}
		JSONObject object = new JSONObject();
		object.put("success",true);
		WEBUtil.writeJson(response, object.toString());
	}

}
