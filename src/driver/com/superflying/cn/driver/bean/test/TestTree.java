package com.superflying.cn.driver.bean.test;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.base.BaseEntity;

@Entity
@Table(name = "test_tree")
public class TestTree extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	@Column(name = "name_")
	private String name;
	
	@Column(name = "parent_id")
	private Long parentId;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}
	
	public JSONObject toJson(){
		JSONObject json = new  JSONObject();
		json.put("id", this.getId()+"");
		json.put("text", this.getName());
//		json.put("leaf", "true");
		return json;
	}
}
