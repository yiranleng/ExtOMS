package com.superflying.cn.web.action.test;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fins.org.json.JSONArray;
import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.driver.bean.test.TestTree;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

@Controller
@RequestMapping("testTree")
public class TestTreeAction {
	
	@RequestMapping("home")
	public String home(){
		return "pages/test/treePaneldiv";
	}
	
	@RequestMapping("getChild")
	public void getChild(@RequestParam(required=false)Long parentId,HttpServletResponse response){
		List<TestTree> list = DaoUtil.getTestTreeDao().findByParentId(parentId);
		JSONArray ary = new JSONArray();
		for(TestTree node : list){
			ary.put(node.toJson());
		}	
		WEBUtil.writeJson(response, ary.toString());
	}
	
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
	
}
