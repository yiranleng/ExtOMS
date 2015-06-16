package com.superflying.cn.web.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import com.superflying.cn.driver.bean.Terminal;
import com.superflying.cn.util.DaoUtil;

@Controller
@RequestMapping("test")
public class MainAction {

	@Autowired
	private RequestMappingHandlerAdapter test;

	@RequestMapping(value = "index")
	public String index(ModelMap model) {
		List<Terminal> list = DaoUtil.getTestDao().find();
		System.out.println(list.size());
		for (Terminal t : list) {
			System.out.println(t.getName());
		}
		return "test/MyJsp";
	}

	@RequestMapping(value = "test")
	public @ResponseBody
	Map<?, ?> test() {
		List<HttpMessageConverter<?>> list = test.getMessageConverters();
		for (HttpMessageConverter con : list) {
			System.out.println(con.toString());
		}
		Map<String, String> map = new HashMap<String, String>();
		map.put("1", "1111111");
		map.put("2", "2222222");
		return map;
	}

	@RequestMapping(value = "list")
	public @ResponseBody
	List<?> list() {
		List<String> list = new ArrayList<String>();
		list.add("01");
		list.add("12");
		list.add("23");
		list.add("34");
		return list;
	}

}
