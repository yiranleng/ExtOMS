package com.superflying.cn.web.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.util.Constants;
import com.superflying.cn.util.DaoUtil;
import com.superflying.cn.util.WEBUtil;

@Controller
@RequestMapping(value = "/login")
public class IdentityAction {

	/**
	 * 跳转到登录页面
	 * @param error
	 * @param model
	 * @return
	 */
	@RequestMapping("index")
	public String login(@RequestParam(value = "error", required = false)
	String error, ModelMap model) {
		if (error != null && !"".equals(error)) {
			model.put("error", error);
		}
		return "content/login";
	}

	/**
	 * 跳转到主页面
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping("/main")
	public String main(HttpServletRequest request, ModelMap model) {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute(Constants.IDENTITY_USER);
		if (user == null) {
			UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			// 取当前登录用户权限
			// Collection<GrantedAuthority> authorities =
			// userDetails.getAuthorities();
			String userCode = userDetails.getUsername();
			user = DaoUtil.getUserDao().findByName(userCode);
			if (user == null || !user.getValid()) {// 加判断，如果租户被注销，返回登录页面
				return "login";
			}

			// 获取IP
			// String ip = request.getHeader("x-forwarded-for");
			// if (ip == null || ip.length() == 0
			// || "unknown".equalsIgnoreCase(ip)) {
			// ip = request.getHeader("Proxy-Client-IP");
			// }
			// if (ip == null || ip.length() == 0
			// || "unknown".equalsIgnoreCase(ip)) {
			// ip = request.getHeader("WL-Proxy-Client-IP");
			// }
			// if (ip == null || ip.length() == 0
			// || "unknown".equalsIgnoreCase(ip)) {
			// ip = request.getRemoteAddr();
			// }
			//			
			// if (ip != null && ip.length() != 0
			// && !"unknown".equalsIgnoreCase(ip)) {
			// int trustIPIdx=ip.indexOf(",");
			// if(trustIPIdx>0){
			// ip=ip.substring(0,trustIPIdx);
			// }
			// su.setIpAddress(ip);
			// }
			WEBUtil.setCurrentSysUser(session, user);
		}
		// 记录用户登录操作
		// SysLogUtil.build(request, null, null);
		return "content/main";
	}
}
