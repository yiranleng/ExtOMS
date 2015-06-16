package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.base.BaseEntity;

/**
 * @author wuxiaoxu 20130720 
 * @see 主题
 */
@Entity
@Table(name = "theme")
public class Theme extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	@Column(name = "name_")
	private String name;
	
	@Column(name = "path_thumb_nail")
	private String pathThumbNail;
	
	@Column(name = "path_file")
	private String pathFile;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPathFile() {
		return pathFile;
	}

	public void setPathFile(String pathFile) {
		this.pathFile = pathFile;
	}

	public String getPathThumbNail() {
		return pathThumbNail;
	}

	public void setPathThumbNail(String pathThumbNail) {
		this.pathThumbNail = pathThumbNail;
	}

	public JSONObject toJson(){
		JSONObject json = new JSONObject();
		json.put("id",id);
		json.put("name",name);
		json.put("pathThumbNail",pathThumbNail);
		json.put("pathFile",pathFile);
		return json;
	}
}
