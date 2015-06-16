package com.superflying.cn.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.superflying.cn.driver.bean.sys.Function;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.util.CommonUtil;
import com.superflying.cn.util.DaoUtil;

/**
 * @author wuxiaoxu 20130719
 * @see 实现SpringSecurity的UserDetailsService接口,实现获取用户Detail信息的回调函数.
 */

public class CustomUserDetailsService implements UserDetailsService {

	private static final Log logger=LogFactory.getLog(CustomUserDetailsService.class);
	
	/**
	 * @see 获取用户信息
	 * 获取用户Details信息的回调函数.
	 */
	@Override
	public UserDetails loadUserByUsername(String userCode) throws UsernameNotFoundException, DataAccessException {
		User user = DaoUtil.getUserDao().findByName(userCode);
		if (user == null) {
			throw new UsernameNotFoundException("用户" + userCode + " 不存在");
		}
		Set<GrantedAuthority> grantedAuths = obtainGrantedAuthorities(user);
		//-- 项目中无以下属性, 暂时全部设为true. --//
		boolean accountNonExpired = true;
		boolean credentialsNonExpired = true;
		boolean accountNonLocked = true;
		logger.info(userCode+"用户开始登录");
		
		UserDetails userdetails = new org.springframework.security.core.userdetails.User(
				user.getName(), user.getPassword(), user.getValid(),
				accountNonExpired, credentialsNonExpired, accountNonLocked,
				grantedAuths);
		return userdetails;
	}

	/**
	 * @see 获得用户权限集合,Function中的code
	 * @param user
	 * @return 权限集合
	 */
	private Set<GrantedAuthority> obtainGrantedAuthorities(User user) {
		Set<GrantedAuthority> authSet = new HashSet<GrantedAuthority>();
//		Object ret = CacheBusinessUtil.getUserAuthority(user.getName());
//		if(ret==null){
			user = DaoUtil.getUserDao().findByName(user.getName());
			List<Function> list = DaoUtil.getFunctionDao().getFunctionList(user);
			if(CommonUtil.isNotEmpty(list)){
				for(Function fun : list){
					authSet.add(new GrantedAuthorityImpl(fun.getCode()));
				}
			}
//			CacheBusinessUtil.setUserAuthority(user.getName(), authSet);
//		}else{
//			authSet = (Set<GrantedAuthority>) ret;
//		}
		return authSet;
	}
}
