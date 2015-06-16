<%@ page errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8"%>
<%@ include file="/WEB-INF/common/taglibs.jsp"%>
<%--wuxiaoxu 20130719 因springsecurity3 鉴权后直接跳转到指定的jsp页面所以在要强制其跳转的登录action去记录信息--%>
<%-- wuxiaoxu 20130719 因EL表达式只能从Attribute中取值所以需麻烦一次 --%>
<% 
String error =request.getParameter("error"); 
request.setAttribute("error", error);
%>
<c:if test="${error != '' && error != null}">
	<c:redirect url="/login/index?error=${error}" />
</c:if>
<c:if test="${error == '' || error == null}">
	<c:redirect url="/login/index" />
</c:if>

