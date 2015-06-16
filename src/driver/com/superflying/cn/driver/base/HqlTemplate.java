package com.superflying.cn.driver.base;

import java.sql.Types;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;

import com.superflying.cn.util.CommonUtil;


/**
 * hql查询模板类
 */
public class HqlTemplate {
	/**
	 * 是否为begin(即左括号)的开始，如果是，则不需要加逻辑操作符(not and or)做前缀
	 */
	private boolean isBeginFirst;

	/**
	 * 记录当前逻辑操作符，缺省为and，调用not(),and(),or()将更新操作符
	 */
	private String current_operator;

	/**
	 * 当前request对象
	 */
	private final HttpServletRequest request;

	/**
	 * 临时用的共用StringBuffer对象
	 */
	private final StringBuffer sb = new StringBuffer();

	/**
	 * 存放生成的sql、hql
	 */
	private final StringBuffer hql;

	/**
	 * 存放对应sql,hql中的参数值
	 */
	private final List<Object> params;

	/**
	 * 模板构造函数
	 * 
	 * @param callback回调对象
	 */
	public HqlTemplate(HttpServletRequest request) {
		isBeginFirst = false;
		current_operator = HqlConst.AND;
		hql = new StringBuffer();
		// 缺省8个参数
		params = new ArrayList<Object>(8);

		this.request = request;
	}

	/**
	 * 根据hql和params的内容，构建query对象
	 * 
	 * @return
	 */
	public Query createQuery(Session session) {
		// 创建query，并设置查询参数
		Query query = session.createQuery(hql.toString());
		for (int i = 0; i < params.size(); i++) {
			query.setParameter(i, params.get(i));
		}

		return query;
	}

	/**
	 * 根据sql和params的内容，构建query对象
	 * 
	 * @return
	 */
	public Query createSQLQuery(Session session) {
		// 创建query，并设置查询参数
		Query query = session.createSQLQuery(hql.toString());
		for (int i = 0; i < params.size(); i++) {
			query.setParameter(i, params.get(i));
		}

		return query;
	}

	public void setCurrentLogicOperator(String logicOperator) {
		current_operator = logicOperator;
	}

	/**
	 * 添加逻辑操作符(not and or)
	 * 
	 */
	private void addOperator() {
		// 如果是开始的第一个条件，则不需要加逻辑操作符
		if (isBeginFirst) {
			isBeginFirst = false;
		} else {
			hql.append(current_operator);
		}

		// 重置为and操作
		current_operator = HqlConst.AND;
	}

	/**
	 * 添加查询条件
	 * 
	 * @param name属性名称
	 * @param value属性值
	 * @param operator运算符
	 *            (>,=, <...)
	 */
	private boolean add(String name, Object value, String operator) {
		if (value == null) {
			return false;
		}

		if (value instanceof String && ((String) value).length() == 0) {
			return false;
		}

		if (value instanceof String) {
			value = ((String) value).trim();
		}

		addOperator();
		hql.append(name);
		hql.append(operator);
		hql.append("?");

		params.add(value);

		return true;
	}

	/**
	 * 添加in查询条件
	 * 
	 * @param name属性名
	 * @param values参数值数组
	 * @param type参数值的类型
	 */
	private void addIn(String name, Object[] values, int type) {
		if (values == null || values.length == 0) {
			return;
		}

		addOperator();
		hql.append(name);
		hql.append(HqlConst.IN);
		hql.append(HqlConst.BEGIN);

		Object value;
		for (int i = 0; i < values.length; i++) {
			if (i > 0) {
				hql.append(HqlConst.IN_COMMA);
			}
			hql.append(HqlConst.PARAM);
			value = values[i];
			value = getValue(value.toString(), type);

			params.add(value);
		}

		hql.append(HqlConst.END);
	}

	/**
	 * 根据type转换参数值
	 * 
	 * @param value字符串格式的值
	 * @param type类型
	 * @return
	 */
	private Object getValue(String value, int type) {
		if (StringUtils.isEmpty(value)) {
			return null;
		}

		Object value2;
		switch (type) {
		case Types.INTEGER:
			value2 = new Integer(value);
			break;
		case Types.BIGINT:
			value2 = new Long(value);
			break;
		case Types.DOUBLE:
			value2 = new Double(value);
			break;
		case Types.DATE:
		case Types.TIMESTAMP:
			value2 = CommonUtil.parseDate(value);
			break;
		default:
			value2 = value;
		}
		return value2;
	}

	/**
	 * 从request中获取参数值
	 * 
	 * @param name参数名称
	 * @param type参数类型
	 * @return
	 */
	private Object getReqValue(String name, int type) {
		String value = request.getParameter(name);
		return getValue(value, type);
	}

	/**
	 * 从rquest中获取值，添加查询条件
	 * 
	 * @param name属性名
	 * @param value参数值的名称
	 * @param operator操作付
	 *            (>,=, <...)
	 * @param type参数值的类型
	 */
	private boolean addReq(String name, String value, String operator, int type) {
		Object value2 = getReqValue(value, type);
		return add(name, value2, operator);
	}

	/**
	 * 添加逻辑运算符
	 * 
	 * @param s
	 * @param isBegin
	 */
	private void addLogic(String s, boolean isBegin) {
		isBeginFirst = isBegin;
		if (isBegin) {
			hql.append(s);
			hql.append(HqlConst.BEGIN);
		} else {
			current_operator = s;
		}
	}

	/**
	 * 重置数据
	 * 
	 */
	public void clear() {
		hql.setLength(0);
		params.clear();
		clearSb();
	}

	/**
	 * 追加hql内容
	 * 
	 * @param s
	 */
	public void appendHql(String s) {
		hql.append(s);
	}

	/**
	 * 追加hql数据及参数值
	 * 
	 * @param s
	 * @param param
	 */
	public void appendHql(String s, Object param) {
		appendHql(s);
		appendParam(param);
	}

	/**
	 * 追加hql数据及参数值数组
	 * 
	 * @param s
	 * @param param
	 */
	public void appendHql(String s, Object[] params) {
		appendHql(s);
		for (int i = 0; i < params.length; i++) {
			appendParam(params[i]);
		}
	}

	/**
	 * 追加hql中的参数值
	 * 
	 * @param param
	 */
	public void appendParam(Object param) {
		params.add(param);
	}

	/**
	 * 清除临时用的StringBuffer
	 * 
	 */
	public void clearSb() {
		sb.setLength(0);
	}

	/**
	 * 追加内容s到sb中
	 * 
	 * @param s
	 */
	public void appendSb(String s) {
		sb.append(s);
	}

	/**
	 * 追加sb的内容到hql中，并清除sb的内容，以便继续使用
	 * 
	 */
	public void appendSbToHql() {
		hql.append(sb.toString());

		clearSb();
	}

	/**
	 * 添加not运算符
	 * 
	 */
	public void not() {
		addLogic(HqlConst.NOT, false);
	}

	/**
	 * 添加and运算符
	 * 
	 */
	public void and() {
		addLogic(HqlConst.AND, false);
	}

	/**
	 * 添加or运算符
	 * 
	 */
	public void or() {
		addLogic(HqlConst.OR, false);
	}

	/**
	 * 添加"not("运算符，其后必须调用end()方法，以使最终结果成为not(...)
	 * 
	 */
	public void notBegin() {
		addLogic(HqlConst.NOT, true);
	}

	/**
	 * 添加"and("运算符，其后必须调用end()方法，以使最终结果成为and(...)
	 * 
	 */
	public void andBegin() {
		addLogic(HqlConst.AND, true);
	}

	/**
	 * 添加"or("运算符，其后必须调用end()方法，以使最终结果成为or(...)
	 * 
	 */
	public void orBegin() {
		addLogic(HqlConst.OR, true);
	}

	/**
	 * 添加(，其后必须调用end()方法，以使最终结果成为(...)
	 * 
	 */
	public void begin() {
		addOperator();
		hql.append(HqlConst.BEGIN);
		isBeginFirst = true;
	}

	/**
	 * 添加)
	 * 
	 */
	public void end() {
		hql.append(HqlConst.END);
	}

	/**
	 * 添加like查询条件
	 * 
	 * @param name属性名
	 * @param value参数值
	 * @param matchMode匹配模式
	 *            ，参见hibernate的MatchMode
	 */
	public boolean like(String name, String value, MatchMode matchMode) {
		if (StringUtils.isEmpty(value)) {
			return false;
		}

		value = value.trim();
		sb.setLength(0);
		boolean isAnyWhere = MatchMode.ANYWHERE.equals(matchMode);
		if (isAnyWhere || MatchMode.START.equals(matchMode)) {
			sb.append(HqlConst.LIKE_TAG);
		}
		sb.append(value);
		if (isAnyWhere || MatchMode.END.equals(matchMode)) {
			sb.append(HqlConst.LIKE_TAG);
		}

		return add(name, sb.toString(), HqlConst.LIKE);
	}

	/**
	 * 添加between and 查询条件
	 * 
	 * @param name属性名
	 * @param value1参数值1
	 * @param value2参数值2
	 */
	public void between(String name, Object value1, Object value2) {
		if (value1 == null && value2 == null) {
			return;
		}

		String s1, s2;
		if (value1 instanceof String) {
			s1 = (String) value1;
		} else {
			s1 = null;
		}
		if (value2 instanceof String) {
			s2 = (String) value2;
		} else {
			s2 = null;
		}

		// 如果是日期型，则结束日期加一天
		if (value2 != null && value2 instanceof Date) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime((Date) value2);
			calendar.add(Calendar.DAY_OF_YEAR, 1);

			value2 = calendar.getTime();
		}

		if (value1 != null && value2 != null) {
			if (s1 == null
					|| (s1 != null && s2.length() > 0 && s2.length() > 0)) {
				addOperator();
				hql.append(name);
				hql.append(HqlConst.BETWEEN);
				hql.append(HqlConst.PARAM);
				hql.append(HqlConst.AND);
				hql.append(HqlConst.PARAM);

				params.add(value1);
				params.add(value2);
			} else {
				if (s1.length() > 0) {
					add(name, value1, HqlConst.GE);
				} else {
					add(name, value2, HqlConst.LE);
				}
			}
		} else {
			if (value1 != null) {
				add(name, value1, HqlConst.GE);
			} else {
				add(name, value2, HqlConst.LE);
			}
		}
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void eq(String name, Object value) {
		add(name, value, HqlConst.EQ);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void ne(String name, Object value) {
		add(name, value, HqlConst.NE);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void gt(String name, Object value) {
		add(name, value, HqlConst.GT);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void ge(String name, Object value) {
		add(name, value, HqlConst.GE);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void lt(String name, Object value) {
		add(name, value, HqlConst.LT);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param value参数值
	 */
	public void le(String name, Object value) {
		add(name, value, HqlConst.LE);
	}

	/**
	 * 添加in查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param values参数值列表
	 */
	@SuppressWarnings("null")
	public void in(String name, Collection<Object> values, int type) {
		if (values != null || values.size() > 0) {
			addIn(name, values.toArray(), type);
		}
	}

	/**
	 * 添加in查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * 
	 * @param name属性名
	 * @param values参数值数组
	 */
	public void in(String name, Object[] values, int type) {
		addIn(name, values, type);
	}

	/**
	 * 根据value，添加is null(<>1)或is not null(=1)
	 * 
	 * @param name
	 * @param value
	 */
	public void isNull(String name, String value) {
		if (StringUtils.isNotEmpty(value)) {
			appendHql(" and c.custReportId is");

			if ("1".equals(value)) {
				appendHql(" not");
			}
			appendHql(" null");
		}
	}

	/**
	 * 添加like查询条件，从request中取值
	 * 
	 * @param name属性名
	 * @param value参数名称
	 * @param matchMode匹配模式
	 *            ，参见hibernate的MatchMode
	 */
	public boolean likeReq(String name, String value, MatchMode matchMode) {
		value = request.getParameter(value);
		return like(name, value, matchMode);
	}

	/**
	 * 根据请求参数值，添加is null(<>1)或is not null(=1)
	 * 
	 * @param name
	 * @param value
	 */
	public void isReqNull(String name, String value) {
		value = request.getParameter(value);
		isNull(name, value);
	}

	/**
	 * 添加between and 查询条件，从request中取值
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReq(String name, String value1, String value2) {
		value1 = request.getParameter(value1);
		value2 = request.getParameter(value2);

		between(name, value1, value2);
	}

	/**
	 * 添加between and 查询条件，从request中取值（integer型值）
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReqInt(String name, String value1, String value2) {
		Object v1 = getReqValue(value1, Types.INTEGER);
		Object v2 = getReqValue(value2, Types.INTEGER);

		between(name, v1, v2);
	}

	/**
	 * 添加between and 查询条件，从request中取值（long型值）
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReqLong(String name, String value1, String value2) {
		Object v1 = getReqValue(value1, Types.BIGINT);
		Object v2 = getReqValue(value2, Types.BIGINT);

		between(name, v1, v2);
	}

	/**
	 * 添加between and 查询条件，从request中取值（double型值）
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReqDouble(String name, String value1, String value2) {
		Object v1 = getReqValue(value1, Types.DOUBLE);
		Object v2 = getReqValue(value2, Types.DOUBLE);

		between(name, v1, v2);
	}

	/**
	 * 添加between and 查询条件，从request中取值（日期型值）
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReqDate(String name, String value1, String value2) {
		Object v1 = getReqValue(value1, Types.DATE);
		Object v2 = getReqValue(value2, Types.DATE);

		between(name, v1, v2);
	}

	/**
	 * 添加between and 查询条件，从request中取值（日期时间型值）
	 * 
	 * @param name属性名
	 * @param value1参数名称1
	 * @param value2参数名称2
	 */
	public void betweenReqDateTime(String name, String value1, String value2) {
		Object v1 = getReqValue(value1, Types.TIMESTAMP);
		Object v2 = getReqValue(value2, Types.TIMESTAMP);

		between(name, v1, v2);
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取字符串值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean eqReq(String name, String value) {
		return addReq(name, value, HqlConst.EQ, Types.VARCHAR);
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean eqReqInt(String name, String value) {
		return addReq(name, value, HqlConst.EQ, Types.INTEGER);
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean eqReqLong(String name, String value) {
		return addReq(name, value, HqlConst.EQ, Types.BIGINT);
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean eqReqDouble(String name, String value) {
		return addReq(name, value, HqlConst.EQ, Types.DOUBLE);
	}

	/**
	 * 添加=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取日期值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean eqReqDate(String name, String value) {
		return addReq(name, value, HqlConst.EQ, Types.DATE);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取String值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean neReq(String name, String value) {
		return addReq(name, value, HqlConst.NE, Types.VARCHAR);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean neReqInt(String name, String value) {
		return addReq(name, value, HqlConst.NE, Types.INTEGER);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean neReqLong(String name, String value) {
		return addReq(name, value, HqlConst.NE, Types.BIGINT);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean neReqDouble(String name, String value) {
		return addReq(name, value, HqlConst.NE, Types.DOUBLE);
	}

	/**
	 * 添加<>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取日期值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public boolean neReqDate(String name, String value) {
		return addReq(name, value, HqlConst.NE, Types.DATE);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取string值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReq(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.VARCHAR);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReqInt(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.INTEGER);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReqLong(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.BIGINT);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReqDouble(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.DOUBLE);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取日期值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReqDate(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.DATE);
	}

	/**
	 * 添加>查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取日期时间值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void gtReqDateTime(String name, String value) {
		addReq(name, value, HqlConst.GT, Types.TIMESTAMP);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取string值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReq(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.VARCHAR);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReqInt(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.INTEGER);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReqLong(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.BIGINT);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReqDouble(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.DOUBLE);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取date值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReqDate(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.DATE);
	}

	/**
	 * 添加>=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取datetime值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void geReqDateTime(String name, String value) {
		addReq(name, value, HqlConst.GE, Types.TIMESTAMP);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取string值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReq(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.VARCHAR);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReqInt(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.INTEGER);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReqLong(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.BIGINT);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReqDouble(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.DOUBLE);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取date值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReqDate(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.DATE);
	}

	/**
	 * 添加<查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取datetime值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void ltReqDateTime(String name, String value) {
		addReq(name, value, HqlConst.LT, Types.TIMESTAMP);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取string值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReq(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.VARCHAR);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReqInt(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.INTEGER);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReqLong(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.BIGINT);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取double值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReqDouble(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.DOUBLE);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取date值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReqDate(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.DATE);
	}

	/**
	 * 添加<=查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取datetime值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void leReqDateTime(String name, String value) {
		addReq(name, value, HqlConst.LE, Types.TIMESTAMP);
	}

	/**
	 * 添加in查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取string值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void inReq(String name, String value) {
		String[] values = request.getParameterValues(value);
		addIn(name, values, Types.VARCHAR);
	}

	/**
	 * 添加in查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取int值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void inReqInt(String name, String value) {
		String[] values = request.getParameterValues(value);
		addIn(name, values, Types.INTEGER);
	}

	/**
	 * 添加in查询条件，与之前的查询条件是and关系，如需更改，则需要在调用该方法前调用not(),and(),or()方法以更改逻辑关系
	 * (从request中取long值)
	 * 
	 * @param name属性名
	 * @param value参数名称
	 */
	public void inReqLong(String name, String value) {
		String[] values = request.getParameterValues(value);
		addIn(name, values, Types.BIGINT);
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public String getHql() {
		return hql.toString();
	}

	public Object[] getParamValues() {
		return params.toArray();
	}
}