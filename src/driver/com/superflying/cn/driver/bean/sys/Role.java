package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.superflying.cn.driver.base.BaseEntity;

/**
 * @author wuxiaoxu 20130720
 * @see 用户角色
 */
@Entity
@Table(name = "role")
public class Role extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	// 名称
	@Column(name = "name_")
	private String name;

	// 是否有效
	@Column(name = "is_valid")
	private Boolean valid;

	// 功能列表
	// @Lob
	@Column(name = "function_list")
	private String functionList;

	public String getFunctionList() {
		return functionList;
	}

	public void setFunctionList(String functionList) {
		this.functionList = functionList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getValid() {
		return valid;
	}

	public void setValid(Boolean valid) {
		this.valid = valid;
	}

}
