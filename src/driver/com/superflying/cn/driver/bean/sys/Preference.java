package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.superflying.cn.driver.base.BaseEntity;

/**
 * @author wuxiaoxu 20130720 
 * @see 系统菜单
 */
@Entity
@Table(name = "preference")
public class Preference extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	@Column(name = "background_color")
	private String backgroundColor;
	
	@Column(name = "font_color")
	private String fontColor;
	
	@Column(name = "transparency_")
	private String transparency;
	
//	@Column(name = "theme_id")
//	private String themeId;
	
	@ManyToOne(fetch = FetchType.EAGER)//急加载
	@JoinColumn(name = "theme_id")
	private Theme theme;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "wallpaper_id")
	private WallPaper wallPaper;
	
//	@Column(name = "wallpaper_id")
//	private String wallpaperId;
	
	@Column(name = "wallpaper_position")
	private String wallpaperPosition;

	public String getBackgroundColor() {
		return backgroundColor;
	}

	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	public String getFontColor() {
		return fontColor;
	}

	public void setFontColor(String fontColor) {
		this.fontColor = fontColor;
	}

	public String getTransparency() {
		return transparency;
	}

	public void setTransparency(String transparency) {
		this.transparency = transparency;
	}

	public String getWallpaperPosition() {
		return wallpaperPosition;
	}

	public void setWallpaperPosition(String wallpaperPosition) {
		this.wallpaperPosition = wallpaperPosition;
	}

	public Theme getTheme() {
		return theme;
	}

	public void setTheme(Theme theme) {
		this.theme = theme;
	}

	public WallPaper getWallPaper() {
		return wallPaper;
	}

	public void setWallPaper(WallPaper wallPaper) {
		this.wallPaper = wallPaper;
	}

}
