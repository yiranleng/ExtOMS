package com.superflying.cn.driver.bean.sys;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fins.org.json.JSONObject;
import com.superflying.cn.driver.base.BaseEntity;

/**
 * @author wuxiaoxu 20130718 
 */
@Entity
@Table(name = "app_user")
public class User extends BaseEntity<Long> {
	private static final long serialVersionUID = 1L;

	// 登录用户名
	@Column(name = "name_")
	private String name;

	// 密码
	@Column(name = "password_")
	private String password;
	
	//中文名
	@Column(name = "name_ch")
	private String nameCh;
	
	//手机号
	@Column(name = "phone_")
	private String phone;
	
	// 是否有效
	@Column(name = "is_valid")
	private Boolean valid;
	
	 //功能列表
	@Column(name = "function_list")
	private String functionList;

	//角色列表
	@Column(name = "role_list")
	private String roleList;
	
	// 所属租户
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "preference_id")
	private Preference preference;

	public String getFunctionList() {
		return functionList;
	}

	public void setFunctionList(String functionList) {
		this.functionList = functionList;
	}

	public String getName() {
		return name;
	}

	public Preference getPreference() {
		return preference;
	}

	public void setPreference(Preference preference) {
		this.preference = preference;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNameCh() {
		return nameCh;
	}

	public void setNameCh(String nameCh) {
		this.nameCh = nameCh;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getRoleList() {
		return roleList;
	}

	public void setRoleList(String roleList) {
		this.roleList = roleList;
	}

	public Boolean getValid() {
		return valid;
	}

	public void setValid(Boolean valid) {
		this.valid = valid;
	}
	
	public JSONObject toJson(){
		JSONObject json = new JSONObject();
		json.put("id", id);
		json.put("name", name);
		json.put("password", password);
		json.put("nameCh", nameCh);
		json.put("phone", phone);
		json.put("valid", valid);
		return json;
	}

}
