package com.superflying.cn.driver.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.base.HqlTemplate;
import com.superflying.cn.driver.base.Page;
import com.superflying.cn.driver.bean.sys.User;

/**
 * @author wuxiaoxu 20130718
 * see 用户Dao
 * @see 用户
 */
@Service
@Transactional(readOnly=true)
public class UserDao extends BaseDao<User> {
	
	@Transactional
	public void update(User user){
		dao.update(user);
	}
	
	/**
	 * @param ids 1,2,3,4
	 * @return
	 */
	@Transactional
	public int deleteByIds(String ids){
		//这玩意可以处理 Long... ids  和 List<Long>
//		return dao.createQuery("delete from User where id in (:ids)", ImmutableMap.of("ids", ids)).executeUpdate();
		return dao.createQuery("delete from User where id in (" + ids + ")").executeUpdate();
	}
	
	public List<User> find() {
		return dao.find("from User where valid=true");
	}
	
	public User getUserNotLazyById(Long id){
		User user = this.get(id);
		if(null != user.getPreference()){//执行懒加载必须还得要getId？？wuxiaoxu test
			user.getPreference().getId();
		}
		return user;
	}
//	public List<User> findByName(String name) {
//		return dao.find("from User where valid=true and name=?",name);
//	}
	
	@SuppressWarnings("unchecked")
	public List<User> findByStartLimit(int start, int limit) {
//		Query query = dao.createQuery("from User where valid=true order by id desc");
		Query query = dao.createQuery("from User order by id desc");
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return query.list();
	}
	
	/**
	 * @see 获取总数
	 * @return
	 */
	public Long getTotal(){
//		SQLQuery sqlQueryCount =  dao.createSQLQuery("select count(*) from app_user where is_valid=1");
		SQLQuery sqlQueryCount =  dao.createSQLQuery("select count(*) from app_user");
		return Long.parseLong(sqlQueryCount.uniqueResult().toString());
	}
	
	public User findByName(String name) {
		return (User) getSession().createQuery("from User where name=? and valid=true").setString(0, name).uniqueResult();
	}
	
	/**
	 * 根据租户id得到租户下的用户
	 * @param tenantId
	 * @return
	 */
	public List<User> findUserList(String hql) {
		return dao.find(hql);
	}

	public Page<User> find(HqlTemplate ht) {
		Page<User> page = getPage(ht.getRequest());
		return dao.findPage(page, ht);
	}
	
}
