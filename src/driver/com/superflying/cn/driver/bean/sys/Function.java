package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.superflying.cn.driver.base.BaseEntity;

/**
 * 功能权限
 * 
 * @author wuxiaoxu 20130718
 * 
 */
@Entity
@Table(name = "function")
public class Function extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	// 类型：按钮、菜单、链接等
//	@Column(name = "type_")
//	private String type;

	// 功能编码
	@Column(name = "code_")
	private String code;

	// 功能名称
	@Column(name = "name_")
	private String name;

	// 上级功能
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "parent_")
//	private Function parent;

	// 顺序
//	@Column(name = "order_")
//	private Integer order;

	// 是否菜单
//	@Column(name = "is_menu")
//	private Boolean menu;

	// 是否有效
	@Column(name = "is_valid")
	private Boolean valid;

	//分类： 基础功能、平台功能、联通功能、产品功能
//	@Column(name = "class_")
//	private String clazz;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Boolean getValid() {
		return valid;
	}

	public void setValid(Boolean valid) {
		this.valid = valid;
	}

}
