package com.superflying.cn.util;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.superflying.cn.driver.bean.sys.User;


/**
 * 获取Sping web相关属性
 */
public class WEBUtil {

	public static HttpSession getSession() {
		HttpSession session = null;
		try {
			session = getRequest().getSession();
		} catch (Exception e) {
		}
		return session;
	}

	public static HttpServletRequest getRequest() {
		ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		return attrs.getRequest();
	}
	
	public static ServletContext getServletContext() {
		return getSession().getServletContext();
	}

	public static void setCurrentSysUser(User user) {
		setCurrentSysUser(getSession(), user);
	}

	public static void setCurrentSysUser(HttpSession session, User user) {
		// 执行懒加载
//		if (su.getClazz().equals(Constants.SYS_RES_CLASS_UNICOM)) {
//			su.getOrg().getId();
//			su.getOrg().getCity(); //联通组织所属城市
//		}else if(su.getClazz().equals(Constants.SYS_RES_CLASS_CUSTOMER)){
//			su.getCustomer().getId();
//			su.getCustomer().getAreaCode();//客户所属地市
//			su.getCustomer().getCode();
//		}
		session.setAttribute(Constants.IDENTITY_USER, user);
	}
	
	public static User getCurrentSysUser() {
		return (User) getSession().getAttribute(Constants.IDENTITY_USER);
	}
	
    public static void writeJson(HttpServletResponse response, String json){
    	try {
			response.setContentType("text/html;charset=UTF-8");
			response.getWriter().print(json);
		} catch (Exception e) {
			System.out.println(e);
		}
    }
    
	/**
	 * @see spring security 用户信息
	 * @return
	 */
	public static UserDetails getUserDetails(){
		return (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
	
}
