<%@ page errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8"%>
<%@ include file="/WEB-INF/common/taglibs.jsp" %>
<%--wuxiaoxu 20130719 因springsecurity3 鉴权后直接跳转到指定的jsp页面所以在要强制其跳转的登录action去在session中放入必要信息--%>
<c:redirect url="/login/main"/>