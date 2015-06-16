package com.superflying.cn.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.NamedThreadLocal;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class StopWatchHandlerInterceptor extends HandlerInterceptorAdapter {
	private NamedThreadLocal<Long> startTimeThreadLocal = new NamedThreadLocal<Long>("StopWatch-StartTime");

	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		long beginTime = System.currentTimeMillis();// 1、开始时间
		startTimeThreadLocal.set(beginTime);// 线程绑定变量（该数据只有当前请求的线程可见）
		System.out.println("----------------------StopWatchHandlerInterceptor------preHandle------------------");
		return true;// 继续流程
	}

	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		long endTime = System.currentTimeMillis();// 2、结束时间
		long beginTime = startTimeThreadLocal.get();// 得到线程绑定的局部变量（开始时间）
		long consumeTime = endTime - beginTime;// 3、消耗的时间
//		if (consumeTime > 500) {// 此处认为处理时间超过500毫秒的请求为慢请求
		// TODO 记录到日志文件
		System.out.println("----------------------StopWatchHandlerInterceptor-------afterCompletion----------------");
			System.out.println(String.format("%s consume %d millis", request.getRequestURI(), consumeTime));
//		}
	}
}