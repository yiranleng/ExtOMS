package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.superflying.cn.driver.base.BaseEntity;

/**
 * @author wuxiaoxu 20130720 
 * @see 壁纸
 */
@Entity
@Table(name = "user_menu")
public class UserMenu extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	@Column(name = "user_id")
	private Long userId;
	
	@Column(name = "menu_name")
	private String menuName;
	
	@Column(name = "desktop_show")
	private String desktopShow;

	public String getDesktopShow() {
		return desktopShow;
	}

	public void setDesktopShow(String desktopShow) {
		this.desktopShow = desktopShow;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	public static UserMenu createInstance(Long userId,String menuName){
		UserMenu um = new UserMenu();
		um.setUserId(userId);
		um.setMenuName(menuName);
		return um;
	}
	
}
