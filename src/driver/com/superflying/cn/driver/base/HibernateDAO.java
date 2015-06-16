package com.superflying.cn.driver.base;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.LockOptions;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.internal.CriteriaImpl;
import org.hibernate.transform.ResultTransformer;
import org.springside.modules.utils.reflection.ReflectionUtils;

@SuppressWarnings("unchecked")
public class HibernateDAO<T> {

	/* 基本操作 */
	public T get(Serializable id) {
		return (T) getSession().get(entityClass, id);
	}

	public void save(T entity) {
		getSession().save(entity);
	}

	public void saveOrUpdate(T entity) {
		getSession().saveOrUpdate(entity);
	}

	public void update(T entity) {
		getSession().update(entity);
	}

	public int delete(Serializable id) {
		return executeHQL("delete from " + entityClass.getName()
				+ " where id = ?", id);
	}

	public void delete(T entity) {
		getSession().delete(entity);
	}

	public void lock(T entity) {
		getSession().buildLockRequest(LockOptions.UPGRADE).lock(entity);
	}

	public void evict(T entity) {
		getSession().evict(entity);
	}

	public void merge(T entity) {
		getSession().merge(entity);
	}

	public void flush() {
		getSession().flush();
	}

	public <X> X get(Class<X> clazz, Serializable id) {
		return (X) getSession().get(clazz, id);
	}

	public <X> void saveEntity(X x) {
		getSession().save(x);
	}

	public <X> void updateEntity(X x) {
		getSession().update(x);
	}

	/* 查询底层操作 */
	public Query createQuery(final String queryString, final Object... values) {
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}

	public Query createQuery(final String queryString,
			final Map<String, ?> values) {
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			query.setProperties(values);
		}
		return query;
	}

	public Criteria createCriteria(final Criterion... criterions) {
		Criteria criteria = getSession().createCriteria(entityClass);
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}

	public Criteria createCriteria(List<Criterion> criterions) {
		Criteria criteria = getSession().createCriteria(entityClass);
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}

	public SQLQuery createSQLQuery(final String queryString,
			final Object... values) {
		SQLQuery query = getSession().createSQLQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}

	public SQLQuery createSQLQuery(final String queryString,
			final Map<String, ?> values) {
		SQLQuery query = getSession().createSQLQuery(queryString);
		if (values != null) {
			query.setProperties(values);
		}
		return query;
	}
	
	/**
	 * @author zhaosq
	 * @param queryString
	 * @return
	 */
	public SQLQuery createSQLQuery(final String queryString){
		SQLQuery query = getSession().createSQLQuery(queryString);
		return query;
	}

	/* 查询操作 */
	/* hql */
	public <X> List<X> find(final String hql, final Object... values) {
		return createQuery(hql, values).list();
	}

	public <X> List<X> find(final String hql, final Map<String, ?> values) {
		return createQuery(hql, values).list();
	}

	public <X> X findUnique(final String hql, final Object... values) {
		return (X) createQuery(hql, values).uniqueResult();
	}

	public <X> X findUnique(final String hql, final Map<String, ?> values) {
		return (X) createQuery(hql, values).uniqueResult();
	}

	public int executeHQL(final String hql, final Object... values) {
		return createQuery(hql, values).executeUpdate();
	}

	public int executeHQL(final String hql, final Map<String, ?> values) {
		return createQuery(hql, values).executeUpdate();
	}

	/* sql */
	public int executeSQL(String sql, Object... values) {
		return createSQLQuery(sql, values).executeUpdate();
	}

	public int executeSQL(String sql, Map<String, ?> values) {
		return createSQLQuery(sql, values).executeUpdate();
	}

	public <X> List<X> findList(String sql, Map<String, ?> values) {
		return createSQLQuery(sql, values).list();
	}

	public <X> List<X> findList(String sql, Object... values) {
		return createSQLQuery(sql, values).list();
	}

	public <X> List<X> findList(Class<X> clazz, String sql, Object... values) {
		return createSQLQuery(sql, values).addEntity(clazz).list();
	}

	public <X> List<X> findList(String clazz, String sql, Object... values) {
		return createSQLQuery(sql, values).addEntity(clazz).list();
	}

	public <X> List<X> findList(Class<X> clazz, String sql,
			Map<String, ?> values) {
		return createSQLQuery(sql, values).addEntity(clazz).list();
	}

	public <X> List<X> findList(String clazz, String sql, Map<String, ?> values) {
		return createSQLQuery(sql, values).addEntity(clazz).list();
	}

	/* getter and setter */
	public Class<T> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<T> entityClass) {
		this.entityClass = entityClass;
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public Session openSession() {
		return sessionFactory.openSession();
	}

	private Class<T> entityClass;
	private SessionFactory sessionFactory;

	/*********** 从springside3中拷贝的方法 *************/

	/**
	 * 按HQL分页查询.
	 * 
	 * @param page
	 *            分页参数. 注意不支持其中的orderBy参数.
	 * @param hql
	 *            hql语句.
	 * @param values
	 *            数量可变的查询参数,按顺序绑定.
	 * 
	 * @return 分页查询结果, 附带结果列表及所有查询输入参数.
	 */
	public Page<T> findPage(final Page<T> page, final String hql,
			final Object... values) {
		Query q = createQuery(hql, values);

		if (page.isAutoCount()) {
			long totalCount = countHqlResult(hql, values);
			page.setTotalCount(totalCount);
		}

		setPageParameterToQuery(q, page);

		List<T> result = q.list();
		page.setResult(result);
		return page;
	}

	public Page<T> findPage(final Page<T> page, HqlTemplate ht) {
		String hql = ht.getHql();
		Object[] values = ht.getParamValues();
		return findPage(page, hql, values);
	}

	/**
	 * 按HQL分页查询.
	 * 
	 * @param page
	 *            分页参数. 注意不支持其中的orderBy参数.
	 * @param hql
	 *            hql语句.
	 * @param values
	 *            命名参数,按名称绑定.
	 * 
	 * @return 分页查询结果, 附带结果列表及所有查询输入参数.
	 */
	public Page<T> findPage(final Page<T> page, final String hql,
			final Map<String, ?> values) {
		Query q = createQuery(hql, values);

		long totalCount = countHqlResult(hql, values);
		page.setTotalCount(totalCount);

		setPageParameterToQuery(q, page);

		List<T> result = q.list();
		page.setResult(result);
		return page;
	}

	/**
	 * 按Criteria分页查询.
	 * 
	 * @param page
	 *            分页参数.
	 * @param criterions
	 *            数量可变的Criterion.
	 * 
	 * @return 分页查询结果.附带结果列表及所有查询输入参数.
	 */
	public Page<T> findPage(final Page<T> page, final Criterion... criterions) {
		Criteria c = createCriteria(criterions);

		if (page.isAutoCount()) {
			long totalCount = countCriteriaResult(c);
			page.setTotalCount(totalCount);
		}

		setPageParameterToCriteria(c, page);

		List result = c.list();
		page.setResult(result);
		return page;
	}

	/**
	 * 设置分页参数到Query对象,辅助函数.
	 */
	protected Query setPageParameterToQuery(final Query q, final Page<T> page) {
		// hibernate的firstResult的序号从0开始
		q.setFirstResult(page.getFirst() - 1);
		q.setMaxResults(page.getPageSize());
		return q;
	}

	/**
	 * 执行count查询获得本次Hql查询所能获得的对象总数.
	 * 
	 * 本函数只能自动处理简单的hql语句,复杂的hql查询请另行编写count语句查询.
	 */
	protected long countHqlResult(final String hql, final Object... values) {
		String countHql = prepareCountHql(hql);

		try {
			Long count = findUnique(countHql, values);
			return count;
		} catch (Exception e) {
			throw new RuntimeException("hql can't be auto count, hql is:"
					+ countHql, e);
		}
	}

	private String prepareCountHql(String orgHql) {
		String fromHql = orgHql;
		// select子句与order by子句会影响count查询,进行简单的排除.
		fromHql = "from " + StringUtils.substringAfter(fromHql, "from");
		fromHql = StringUtils.substringBefore(fromHql, "order by");

		String countHql = "select count(*) " + fromHql;
		return countHql;
	}

	/**
	 * 执行count查询获得本次Criteria查询所能获得的对象总数.
	 */
	@SuppressWarnings("unchecked")
	protected long countCriteriaResult(final Criteria c) {
		CriteriaImpl impl = (CriteriaImpl) c;

		// 先把Projection、ResultTransformer、OrderBy取出来,清空三者后再执行Count操作
		Projection projection = impl.getProjection();
		ResultTransformer transformer = impl.getResultTransformer();

		List<CriteriaImpl.OrderEntry> orderEntries = null;
		try {
			orderEntries = (List) ReflectionUtils.getFieldValue(impl,
					"orderEntries");
			ReflectionUtils
					.setFieldValue(impl, "orderEntries", new ArrayList());
		} catch (Exception e) {
			e.printStackTrace();
		}

		// 执行Count查询
		Long totalCountObject = (Long) c.setProjection(Projections.rowCount())
				.uniqueResult();
		long totalCount = (totalCountObject != null) ? totalCountObject : 0;

		// 将之前的Projection,ResultTransformer和OrderBy条件重新设回去
		c.setProjection(projection);

		if (projection == null) {
			c.setResultTransformer(CriteriaSpecification.ROOT_ENTITY);
		}
		if (transformer != null) {
			c.setResultTransformer(transformer);
		}
		try {
			ReflectionUtils.setFieldValue(impl, "orderEntries", orderEntries);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return totalCount;
	}

	/**
	 * 设置分页参数到Criteria对象,辅助函数.
	 */
	protected Criteria setPageParameterToCriteria(final Criteria c,
			final Page<T> page) {
		// hibernate的firstResult的序号从0开始
		c.setFirstResult(page.getFirst() - 1);
		c.setMaxResults(page.getPageSize());

		if (page.isOrderBySetted()) {
			String[] orderByArray = StringUtils.split(page.getOrderBy(), ',');
			String[] orderArray = StringUtils.split(page.getOrder(), ',');

			for (int i = 0; i < orderByArray.length; i++) {
				if (Page.ASC.equals(orderArray[i])) {
					c.addOrder(Order.asc(orderByArray[i]));
				} else {
					c.addOrder(Order.desc(orderByArray[i]));
				}
			}
		}
		return c;
	}

	/*********** 拷贝springside3中的方法结束 ********/
}
