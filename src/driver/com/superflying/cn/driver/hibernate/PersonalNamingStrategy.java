package com.superflying.cn.driver.hibernate;

import org.hibernate.cfg.ImprovedNamingStrategy;
import org.hibernate.internal.util.StringHelper;

/**
 * @author wuxiaoxu 20130319
 * @see orm 实体 属性->表字段 命名策略
 * 当添加 (@Column(name = "asdf"))后不再走此策略 
 * 在系统启动时一次转换完成
 * 1.有大写字符的采用hibernate默认转换
 * 2.独单词默认后加"_"
 */
public class PersonalNamingStrategy extends ImprovedNamingStrategy {
	
	private static final long serialVersionUID = 2132725196250080662L;
//	private String tablePrefix = "test";//表名前缀

	/**
	 * @see 属性->表字段 转换规则
	 */
	@Override
	public String propertyToColumnName(String propertyName) {
		if (!hasUpperCase(propertyName)) {
			if (hasDot(propertyName)) {
				return StringHelper.unqualify(propertyName) + "_";
			}
			return propertyName + "_";
		}
		return super.propertyToColumnName(propertyName);
	}
	
	/**
	 * @see 默认类名 转 表名 规则
	 */
//	@Override
//	public String classToTableName(String className) {
//		return (this.tablePrefix + super.classToTableName(className));
//	}

	protected boolean hasUpperCase(String propertyName) {
		return !propertyName.equals(propertyName.toLowerCase());
	}

	protected boolean hasDot(String propertyName) {
		return propertyName.indexOf(".") > 0;
	}
//	wuxiaoxu test
//	public static void main(String[] args) {
//		PersonalNamingStrategy strategy = new PersonalNamingStrategy();
//		System.out.println(strategy.propertyToColumnName("iD"));
//		System.out.println(strategy.propertyToColumnName("id"));
//		System.out.println(strategy.propertyToColumnName("group.id"));
//		System.out.println(strategy.propertyToColumnName("group.phoneNum"));
//		System.out.println(strategy.propertyToColumnName("groupName"));
//	}
}
