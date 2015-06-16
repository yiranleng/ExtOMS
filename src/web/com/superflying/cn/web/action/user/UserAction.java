package com.superflying.cn.web.action.user;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fins.org.json.JSONArray;
import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

/**
 * @see 用户处理
 * @author leng
 */
@Controller
@RequestMapping("user")
public class UserAction {
	
	@RequestMapping("home")
	public String home(){
		return "/pages/user/userHome";
	}
	
	/**
	 * @see 获取表格数据
	 * @param start 开始
	 * @param limit 总数
	 * @param response
	 */
	@RequestMapping("list")
	public void list(@RequestParam(value="start", required=false ,defaultValue="0")String start,
			@RequestParam(value="limit", required=false ,defaultValue="20")String limit,
			HttpServletResponse response){
		JSONArray arry = new JSONArray();
		JSONObject json = new JSONObject();
		List<User> list =  DaoUtil.getUserDao().findByStartLimit(Integer.parseInt(start),Integer.parseInt(limit));
		if(CommonUtil.isNotEmpty(list)){
			for(User u : list){
				arry.put(u.toJson());
			}
		}
		Long resultSize = DaoUtil.getUserDao().getTotal();
		json.put("resultSize", resultSize);
		json.put("dataList", arry);
		WEBUtil.writeJson(response, json.toString());
	}
	
	/**
	 * @author wuxiaoxu 20130724
	 * @see 新增用户
	 * @param user
	 * @param response
	 */
	@RequestMapping("save")
	public void save(User user, HttpServletResponse response){
		User tmp = DaoUtil.getUserDao().findByName(user.getName());
		JSONObject json = new JSONObject();	
		if(null != tmp){//用户名重复
			json.put("msg", "用户名已存在!");	
			json.put("success", "1");
		}else{
			user.setValid(true);
			DaoUtil.getUserDao().save(user);
			json.put("msg", "保存成功!");	
			json.put("success", "0");
		}
		WEBUtil.writeJson(response, json.toString());
	}
	
	/**
	 * @author wuxiaoxu 20130724
	 * @see 编辑用户
	 * @param user
	 * @param response
	 */
	@RequestMapping("edit")
	public void edit(User user, HttpServletResponse response){
		User tmp = DaoUtil.getUserDao().get(user.getId());
		JSONObject json = new JSONObject();	
		if(null == tmp){
			json.put("msg", "保存失败!");	
			json.put("success", "1");
		}else{
			tmp.setNameCh(user.getNameCh());
			//可能不修改密码
			if(!StringUtils.isBlank(user.getPassword())){
				tmp.setPassword(user.getPassword());
			}
			tmp.setPhone(user.getPhone());
			tmp.setValid(user.getValid());
			DaoUtil.getUserDao().update(tmp);
			json.put("msg", "保存成功!");	
			json.put("success", "0");
		}
		WEBUtil.writeJson(response, json.toString());
	}
	
	@RequestMapping("delete")
	public void delete(String ids, HttpServletResponse response){
		JSONObject json = new JSONObject();	
		if(StringUtils.isBlank(ids)){
			json.put("success", false);
			json.put("msg", "删除用户失败!");	
		}else{
			if(ids.endsWith(",")) ids = ids.substring(0,ids.length()-1);
			DaoUtil.getUserDao().deleteByIds(ids);
			DaoUtil.getUserMenuDao().deleteByUserIds(ids);//删除已分配的功能
			json.put("success", true);
			json.put("msg", "删除用户成功!");	
		}
		WEBUtil.writeJson(response, json.toString());
	}
	
}
