package com.superflying.cn.driver.bean;

import javax.persistence.Column;
import javax.persistence.Entity;

import com.superflying.cn.driver.base.BaseEntity;

/**
 * 终端设备
 * 
 * @author lilh
 * 
 */
@Entity
public class Terminal extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	// 设备编号
	@Column(name = "no_")
	private String no;

	// 终端名称/车牌号码
	@Column(name = "name_")
	private String name;

	// 终端分类
	@Column(name = "type_")
	private String type;

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
