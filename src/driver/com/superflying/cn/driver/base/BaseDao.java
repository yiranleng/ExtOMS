package com.superflying.cn.driver.base;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * 所有的业务类需要继承这个基类
 * 对数据库的操作直接使用此类的dao或jdao即可
 * 
 * @author wuxiaoxu
 */
@SuppressWarnings("unchecked")
public class BaseDao<T> {

	protected Class<T> entityClass;
	protected HibernateDAO<T> dao;

	protected SessionFactory sessionFactory;

	public BaseDao() {
		Class<?> clazz = this.getClass();
		Type type = null;
		while (true) {
			type = clazz.getGenericSuperclass();
			if (type instanceof ParameterizedType) {
				break;
			}

			clazz = clazz.getSuperclass();
			if (clazz == null) {
				break;
			}
		}
		if (type == null) {
			throw new RuntimeException("无法找到泛型的提示类！");
		}
		entityClass = (Class<T>) ((ParameterizedType) type)
				.getActualTypeArguments()[0];

		Class<T> mtClass = (Class<T>) HibernateDAO.class
				.asSubclass(HibernateDAO.class);
		try {
			dao = (HibernateDAO<T>) mtClass.newInstance();
			dao.setEntityClass(entityClass);
			dao.setSessionFactory(sessionFactory);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
		dao.setSessionFactory(sessionFactory);
	}

	protected Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	@Transactional
	public void save(T entity) {
		dao.save(entity);
	}

	@Transactional
	public void delete(T entity) {
		dao.delete(entity);
	}

	@Transactional
	public void delete(Serializable id) {
		dao.delete(id);
	}

	@Transactional(readOnly = true)
	public T get(Serializable id) {
		return dao.get(id);
	}

	@Transactional(readOnly = true)
	public <X> X get(Class<X> clazz, Serializable id) {
		return dao.get(clazz, id);
	}

	/**
	 * 缺省每页显示10条
	 * 
	 * @return
	 */
	public Page<T> getPage(HttpServletRequest request) {
		Page<T> page = new Page<T>(request);
		request.setAttribute("page", page);
		return page;
	}
	
	public Page<T> find(HqlTemplate ht) {
		Page<T> page = getPage(ht.getRequest());
		return dao.findPage(page, ht);
	}

	public Page<T> find(HqlTemplate ht,int pageNo) {
		Page<T> page = getPage(ht.getRequest());
		page.setPageNo(pageNo);
		return dao.findPage(page, ht);
	}
}
