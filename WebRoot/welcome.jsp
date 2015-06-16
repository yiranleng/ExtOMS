<%@ include file="/WEB-INF/common/taglibs.jsp"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>



<html>
	<head>
		<title>开放式管理系统</title>
		<base href="<%=basePath%>">

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="opms">


		<!--start stytles  -->
		<link rel="stylesheet" type="text/css"
			href="scripts/ext/resources/css/ext-all.css" />

		<link rel="stylesheet" type="text/css"
			href="scripts/ext/desktop/css/desktop.css" />
		<link rel="stylesheet" type="text/css"
			href="scripts/ext/desktop/colorpicker/colorpicker.css" />
		<link rel="stylesheet" type="text/css"
			href="scripts/ext/desktop/qo-preferences/qo-preferences.css" />
		<!--end stytles  -->


		<!-- GC -->
		<!-- LIBS -->
		<script type="text/javascript"
			src="scripts/ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="scripts/ext/ext-all.js"></script>
		<script type="text/javascript" src="scripts/ext/src/locale/ext-lang-zh_CN.js"></script>
		<!-- ENDLIBS -->

		<!-- DESKTOP -->
		<script type="text/javascript"
			src="scripts/ext/desktop/js/StartMenu.js"></script>
		<script type="text/javascript" src="scripts/ext/desktop/js/TaskBar.js"></script>
		<script type="text/javascript" src="scripts/ext/desktop/js/Shortcut.js"></script>
			
			
			
			
		<script type="text/javascript" src="scripts/ext/desktop/js/Desktop.js"></script>
		<script type="text/javascript" src="scripts/ext/desktop/js/App.js"></script>
		<script type="text/javascript" src="scripts/ext/desktop/js/Module.js"></script>


		
		<script type="text/javascript" src="scripts/ext/Utils.js"></script>
		<script type="text/javascript" src="scripts/ext/monthField.js"></script>


		<!-- theme -->
		<script type="text/javascript"
			src="scripts/ext/desktop/colorpicker/ColorPicker.js"></script>
		<script type="text/javascript"
			src="scripts/ext/desktop/qo-preferences/qo-preferences.js"></script>
		<script type="text/javascript"
			src="scripts/ext/desktop/qo-preferences/qo-preferences-override.js"></script>
		<!-- end theme -->
		
		
		
		<script type="text/javascript" src="scripts/ext/ux/DDView.js"></script>
		<script type="text/javascript" src="scripts/ext/ux/MultiSelect.js"></script>
    	<script type="text/javascript" src="scripts/ext/ux/ItemSelector.js"></script>
		
		
		
		<script type="text/javascript">
			function getError()  {
				var arglen = arguments.length;
				var errors = '';
				for (var i = 0; i < arglen; i++) {
					errors += "," + arguments[i];
				}
				Ext.Ajax.request({
					url : 'login.do',
					params : {
						errorMsg : errors,
						method:'getJavaScriptError'
					}
				});
				return true;
			}
		    window.onerror = getError;
		    
		   	Ext.Ajax.on('requestcomplete', checkUserSessionStatus, this);
			function checkUserSessionStatus(conn, response, options) {
				var sessionStatus = '';
				try{
					sessionStatus= response.getResponseHeader["sessionstatus"];
				}catch(e){return;}
		
				if (typeof(sessionStatus) != "undefined") {
					Ext.Msg.alert('消息', '登陆超时', function(btn, text) {
						if (btn == 'ok' || btn=='yes') {
							var redirect = 'logout.jsp';
							window.location = redirect;
						}
					});
				}
			}
		    
		    
		    
		    
		    
		    
		    
		    
		</script>
		
		
		
		
		

	</head>
	<body scroll="no" oncontextmenu=self.event.returnValue=false onselectstart="return true">

		<div id="x-desktop">
			<a href="http://extjs.com" target="_blank"
				style="margin:5px; float:right;"><img src="scripts/ext/desktop/images/powered.gif" />
			</a>


		</div>
		
		
		
		
		
		
		
		
		<oms:faceTag />
		<oms:GetMessageTag />
		
		
		
		
		
		
		
		
		

		<div id="ux-taskbar">
			<div id="ux-taskbar-start"></div>
			<div id="ux-taskbuttons-panel"></div>
			<div class="x-clear"></div>
		</div>
		<div id="test">

		</div>

	</body>
</html>
