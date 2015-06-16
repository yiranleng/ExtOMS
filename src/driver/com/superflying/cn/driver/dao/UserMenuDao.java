package com.superflying.cn.driver.dao;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.UserMenu;

/**
 * 桌面菜单
 * @author wuxiaoxu 20130719
 */
@Service
@Transactional(readOnly = true)
public class UserMenuDao extends BaseDao<UserMenu> {
	
	public List<UserMenu> find() {
		return dao.find("from UserMenu");
	}
	
	@SuppressWarnings("unchecked")
	public List<String> findByUserID(Long userId) {
		return dao.createSQLQuery("select menu_name from user_menu t where t.user_id = ?").setLong(0, userId).list();
	}
	
	public UserMenu findByUserIdMenuName(Long userId, String menuName) {
		return (UserMenu) dao.createQuery("from UserMenu t where t.userId = ? and t.menuName =?").setLong(0, userId).setString(1, menuName).uniqueResult();
	}
	
	@Transactional
	public int deleteByUserIds(String ids){
		//这玩意可以处理 Long... ids  和 List<Long>
//		return dao.createQuery("delete from User where id in (:ids)", ImmutableMap.of("ids", ids)).executeUpdate();
		return dao.createQuery("delete from UserMenu where userId in (" + ids + ")").executeUpdate();
	}
	
	@Transactional
	public void update(UserMenu userMenu){
		dao.update(userMenu);
	}
	
//	@Transactional
//	public void deleteUserMenus(Long userId){
//		getSession().createQuery("delete from UserMenu t where t.userId = ?").setLong(0, userId).executeUpdate();
//	}
	
	@Transactional
	public void deleteByUserIdMenuName(Long userId,String[] names){
//		String sql = "delete from UserMenu t where t.userId = ? ";
//		if(null == names && names.length == 0){
//			getSession().createQuery(sql).setLong(0, userId).executeUpdate();
//			return;
//		}
		String sql = "delete from UserMenu t where t.userId = ? ";
		String conds = "";
		if(null != names && names.length > 0){
			for(String name : names){
				conds += "'" + name + "',";
			}
			if(conds.endsWith(",")) conds = conds.substring(0,conds.length() - 1);
		}
		sql += "and t.menuName not in ("+conds+")";
		getSession().createQuery(sql).setLong(0, userId).executeUpdate();
	}
	
	/**
	 * @see 保存功能列表
	 * @param list
	 */
//	public void saveMenus(List<UserMenu> list){
//		if(CommonUtil.isEmpty(list)) return;
//		for(UserMenu menu:list){
//			this.save(menu);
//		}
//	}
}
