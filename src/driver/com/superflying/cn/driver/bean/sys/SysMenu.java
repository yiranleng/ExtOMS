package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.superflying.cn.driver.base.BaseEntity;
import com.superflying.cn.util.CommonUtil;

/**
 * @author wuxiaoxu 20130720 
 * @see 系统菜单
 */
@Entity
@Table(name = "sysmenu")
public class SysMenu extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	@Column(name = "parent_name")
	private String parentName;
	
	@Column(name = "name_")
	private String name;

	@Column(name = "title_")
	private String title;
	
	@Column(name = "description_")
	private String description;
	
	@Column(name = "tooltip_")
	private String tooltip;
	
	@Column(name = "mpage_")
	private String mpage;
	
	@Column(name = "width_")
	private String width;
	
	@Column(name = "height_")
	private String height;
	
	@Column(name = "menu_type")
	private String menuType;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMenuType() {
		return menuType;
	}

	public void setMenuType(String menuType) {
		this.menuType = menuType;
	}

	public String getMpage() {
		return mpage;
	}

	public void setMpage(String mpage) {
		this.mpage = mpage;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTooltip() {
		return tooltip;
	}

	public void setTooltip(String tooltip) {
		this.tooltip = tooltip;
	}

	public String getWidth() {
		return width;
	}
	
	@Transient
	public String getWidthWithOutNull() {
		if(CommonUtil.isEmpty(width)) return "0";
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}
	
	public String getHeight() {
		return height;
	}
	
	@Transient
	public String getHeightWithOutNull() {
		if(CommonUtil.isEmpty(height)) return "0";
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

}
