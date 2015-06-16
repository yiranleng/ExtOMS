package com.superflying.cn.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


//spring-mvc 中暂未使用该过滤器
public class TestInterceptor extends HandlerInterceptorAdapter {

	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		System.out.println("----------------------TestInterceptor------preHandle------------------");
		return true;// 继续流程
	}

	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("----------------------TestInterceptor-------afterCompletion----------------");
	}
}