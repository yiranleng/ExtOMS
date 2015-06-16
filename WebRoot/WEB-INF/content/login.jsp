<%@ page errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" type="text/css"
			href="/scripts/ext/resources/css/ext-all.css" />
 	<script type="text/javascript"
			src="/scripts/ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="/scripts/ext/ext-all.js"></script>
    <style type="text/css">
    	.text2 { width:150px; border:solid 2px #acacac; height:22px;font-size:12px; color:#555555; background:#f9f9f9 url(ext/images/icon_padlock.png) right 3px no-repeat;}
    	.text1 { width:150px; border:solid 2px #acacac; height:22px;font-size:12px; color:#555555; background:#f9f9f9 url(ext/images/member.png) right 3px no-repeat;}
    </style>
	<script type='text/javascript'>
	//关闭页面处理函数
//------------------------------------------------------


function msg_dynamic_showText(){  
    var config = {  
        title:'动态提示',  
        msg:'动态更新信息文字',  
        modal:true,  
        buttons:Ext.Msg.OK,  
        width:300  
    }  
      
    var msgBox = Ext.MessageBox.show(config);  
      
    //Ext.TaskMgr用来定时执行程序   
    Ext.TaskMgr.start({  
        run:function(){  
            msgBox.updateText('会动的时间:' + new Date().format('Y-m-d g:i:s A'));  
        },  
        interval:1000       //1s后调用一次   
    });  
}



//------------------------------------------------------
	 function closeIt(){
		var nAppName = navigator.appName;
		var nAppVersion = navigator.appVersion;
		var nVersionNum;
	
		if(nAppName=="Netscape"){
			nVersionNum  = nAppVersion.substring(0,2);
		}else{
			var startPoint = nAppVersion.indexOf("MSIE ")+5;
			nVersionNum = nAppVersion.substring(startPoint,startPoint+3);
		}
		try{
	     		if(nAppName=="Microsoft Internet Explorer"){	//IE5.5 Up
	     			if(nVersionNum >= 7){
						window.open("closeIE7.jsp","_self");
					}else if(nVersionNum>5.5){
			     		 window.close();
	     			}else{//IE5.5 down
	               			 closes.Click();
	     			}
	     		}else{
	     				window.close();
	     		}
		}catch(e){}
	}
		var request = false;
function createRequest(){
	try{
		request = new XMLHttpRequest();// Mozilla,Safari,Opera,IE7等	
	} catch (e){//Ie7以前的版本
		try{
			request = new ActiveXObject("Msxml2.XMLHTTP");//IE较新版本
		}catch(e1){
			try{
				request = new ActiveXObject("Microsoft.XMLHTTP");//ie较老版本
			}catch(e2){
				request = false;
			}
		}
	}
	if(!request){
		Ext.Msg.alert('您的浏览器到底是啥程序无法识别');
	}
}


//wuxiaoxu 20111217 请求登录 ajax更改为使用Ext ajax
var i = 0;
function processAjax(){
	var name = document.getElementById("j_username").value;
	var password = document.getElementById("j_password").value;
	if(name=="" || name==null){
		Ext.Msg.alert('友情提示','请输入账号！');
		return;
	}else if(password=="" || password==null){
		Ext.Msg.alert('友情提示','请输入密码！');
		return;
	}
	
		//------------------------------------------------
    Ext.MessageBox.show({
        title: '请等待',
        msg: '系统正在验证用户信息请稍后！',
        width:240,
        //progress:true,//这个是外间控制的进度条
        wait : true,//系统自动运行的工具条
        closable:false
    });

//------------------------------------------------
Ext.lib.Ajax.request('POST',"${ctx}/j_spring_security_check&j_username="+name+"&j_password="+password,{
			success : function(response) {
				var json = Ext.util.JSON.decode(response.responseText);
				if (json.msg == 'true') {
					window.opener = null;
					//var openWin = window.open('welcome.jsp','_blank','top=0,left=0,status=yes,menubar=no,resizable=yes,scrollbars=yes');
					var openWin = window.open('welcome.jsp','_blank','top=0,left=0,status=no,menubar=no,resizable=yes,scrollbars=no');
   	  			 	openWin.resizeTo(screen.availWidth,screen.availHeight); 
					closeIt();
				} else {
					document.getElementById("j_username").value='';
					document.getElementById("j_password").value='';
					i++;
					if(i>2){
						closeIt();
					}
					Ext.Msg.alert('友情提示','账号或密码错误请重新输入');
				}
			},
			failure : function() {
				Ext.Msg.alert('友情提示', '与后台联系的时候出现了问题');
			}
		});
		
}	
</script>

<title>opms管理系统</title>
<link href="/static/login/login.css" rel="stylesheet" type="text/css" />
<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
<%--//	overflow:hidden;--%>
<%--	overflow: scroll;--%>
	overflow: auto;
}
.STYLE3 {color: #797979; font-size: 15px; }
.STYLE4 {
	color: #42870a;
	font-size: 12px;
}
-->
</style></head>

<body bgcolor="#8a8a8a">



<table width="1200" height="600" align="center" bordercolor="#ECE9D8"  id="biaoge">
	<td align="center" valign="middle">
	  <div id='center'> 
			<div id='inner' style="top: 329px; left: 650px;">
				<form id="loginForm" action="${ctx}/j_spring_security_check" method="post">
		    		<span class="STYLE3">账号</span>
		    		<input type="text" name="j_username"  id="j_username" class="text1"/><br><br>
	                <span class="STYLE3">密码</span>
	                <input type="j_password" name="j_password" id="j_password" class="text2"/>
	                <br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<%--				 	<input type="image"  src="/static/login/buttonlogin.png" width="60" height="25" border="0" onClick="processAjax()" value='登录' />--%>
				 	<input type="image"  src="/static/login/buttonlogin.png" width="60" height="25" border="0" type="submit" value='登录' />
					&nbsp;&nbsp; <input type="image" src="/static/login/cancel.png" width="60" height="25" border="0" onClick="javascript:window.close()" value='退出' />
				</form>
			</div>
      </div></td>
</table>

</body>
</html>
