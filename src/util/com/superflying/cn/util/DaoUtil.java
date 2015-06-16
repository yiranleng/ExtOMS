package com.superflying.cn.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.superflying.cn.driver.dao.FunctionDao;
import com.superflying.cn.driver.dao.PreferencesDao;
import com.superflying.cn.driver.dao.SysMenuDao;
import com.superflying.cn.driver.dao.TestDao;
import com.superflying.cn.driver.dao.ThemeDao;
import com.superflying.cn.driver.dao.UserDao;
import com.superflying.cn.driver.dao.UserMenuDao;
import com.superflying.cn.driver.dao.WallPaperDao;
import com.superflying.cn.driver.dao.test.TestTreeDao;
/**
 * @author wuxiaoxu 20130908
 * @see 调用dao的工具类
 */
@Component
public final class DaoUtil {
private static DaoUtil instance = null;
	
	/**
	 * @author wuxiaoxu 20130908
	 * @see 次构造函为避免恶意构造必须定义为private因spring通过反射调用构造函数时临时将其改变为public所以依然可正常调用
	 */
	private DaoUtil(){
		instance = this;
	}
	
	/*
	 * 在接口前面标上@Autowired和@Qualifier注释使得接口可以被容器注入，当接口存在两个实现类的时候必须指定其中一个来注
	 * 入，使用实现类首字母小写的字符串来注入，如：
     * @Autowired      
     * @Qualifier("chinese")  
	 */
	@Autowired
	private TestDao testDao;
	
	@Autowired
	private TestTreeDao testTreeDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private FunctionDao functionDao;
	
	@Autowired
	private SysMenuDao sysMenuDao;
	
	@Autowired
	private PreferencesDao preferencesDao;
	
	@Autowired
	private ThemeDao themeDao;
	
	@Autowired
	private WallPaperDao wallPaperDao;
	
	@Autowired
	private UserMenuDao userMenuDao;

	
	public static TestDao getTestDao() {
		return instance.testDao;
	}
	
	public static UserDao getUserDao() {
		return instance.userDao;
	}

	public static FunctionDao getFunctionDao() {
		return instance.functionDao;
	}
	
	public static SysMenuDao getSysMenuDao() {
		return instance.sysMenuDao;
	}
	
	public static PreferencesDao getPreferencesDao() {
		return instance.preferencesDao;
	}
	
	public static ThemeDao getThemeDao() {
		return instance.themeDao;
	}
	
	public static WallPaperDao getWallPaperDao() {
		return instance.wallPaperDao;
	}
	
	public static UserMenuDao getUserMenuDao() {
		return instance.userMenuDao;
	}

	public static TestTreeDao getTestTreeDao() {
		return instance.testTreeDao;
	}
	
}
