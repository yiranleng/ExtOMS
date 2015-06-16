1.本软件为给予Ext,springMVC,Hibernate的管理系统开发框架
2.lib中的jar分文件夹存放了所以发布到tomcat下时还需拿出来，此处暂未处理


wuxiaoxu 20130321 web 中添加hibernate 的延迟加载过滤器
晚上 添加 拦截器
20130325 添加 json 自动解析


这玩意可以处理 Long... ids  和 List<Long>
return dao.createQuery("delete from User where id in (:ids)", ImmutableMap.of("ids", ids)).executeUpdate();
		
		
在其他实体的service当中 User user = get(User.class, userId); 通过此种方法可以查到非相关实体