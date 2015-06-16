package com.superflying.cn.driver.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.SysMenu;

/**
 * @author wuxiaoxu 20130718 see 用户Dao
 */
@Service
@Transactional(readOnly = true)
public class SysMenuDao extends BaseDao<SysMenu> {
	// @Autowired
	// private FunctionService functionService;

	public List<SysMenu> find() {
		return dao.find("from SysMenu");
	}

	public Map<String, SysMenu> getAllMenu() {
		Map<String, SysMenu> map = new HashMap<String, SysMenu>();
		List<SysMenu> list = find();
		for (SysMenu menu : list) {
			map.put(menu.getName(), menu);
		}
		return map.size() < 1 ? null : map;
	}

	/**
	 * @see 用户已有的功能
	 * @param userId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<SysMenu> getUserMenu(long userId) {
		String sql = "select * from sysmenu t where t.name_ in (select u.menu_name from user_menu u where u.user_id = ?) and t.menu_type=1 ";
		return getSession().createSQLQuery(sql).addEntity(SysMenu.class).setLong(0, userId).list();
	}
	
	/**
	 * @see 用户没有的功能
	 * @param userId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<SysMenu> getOtherMenu(long userId) {
		String sql = "select * from sysmenu t where t.name_ not in (select menu_name from user_menu where user_id = ?) and t.menu_type=1";
		return getSession().createSQLQuery(sql).addEntity(SysMenu.class).setLong(0, userId).list();
		
	}

	/**
	 * wuxiaoxu 20120806 获取用户在桌面上显示的图标
	 */
	@SuppressWarnings("unchecked")
	public List<SysMenu> getUserDesktopMenu(long userId) {
		String sql = "select * from sysmenu o where o.name_ in (select  t.menu_name from user_menu t where t.desktop_show=1 and t.user_id=?)";
		return getSession().createSQLQuery(sql).addEntity(SysMenu.class).setLong(0, userId).list();
	}
	
}
