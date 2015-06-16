package com.superflying.cn.web.action.function;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fins.org.json.JSONObject;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.WEBUtil;

@Controller
@RequestMapping("email")
public class EmailAction {

//	@Autowired
//	private PkgServer pkgServer;
	
	@RequestMapping("home")
	public String home(){
		return "pages/email/home";
	}
	
	/**
	 * @see 发送邮件
	 */
	@RequestMapping("sendEmail")
	public void sendEmail(String email, String subject, String content,
			HttpServletResponse response) {
		Properties pro = new Properties();
		String path = WEBUtil.getServletContext().getRealPath("/");
		path = path + "/properties/email.properties";
		boolean flag = false;
		try {
			FileInputStream fs = new FileInputStream(path);
			pro.load(fs);
//			flag = CommonUtil.sendEmail(pro, email, subject, content);
			flag = CommonUtil.sendHtmlEmail(pro, email, subject, content);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		JSONObject json = new JSONObject();
		if (flag) {
			json.put("success", "true");
			json.put("msg", "发送电子邮件成功！");
		} else {
			json.put("success", "false");
			json.put("msg", "发送电子邮件失败！");
		}
		WEBUtil.writeJson(response, json.toString());
	}

}
