package com.superflying.cn.driver.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.base.HqlTemplate;
import com.superflying.cn.driver.base.Page;
import com.superflying.cn.driver.bean.sys.Role;
import com.superflying.cn.driver.bean.sys.User;

/**
 * @author wuxiaoxu 20130720
 * @see 角色service
 */
@Service
@Transactional(readOnly = true)
public class RoleDao extends BaseDao<Role> {
	public List<Role> findRoles() {
		return dao.find("from Role");
	}

	public List<Role> findValidRoles() {
		return dao.find("from Role where valid =true");
	}

	public Page<Role> find(HqlTemplate ht) {
		Page<Role> page = getPage(ht.getRequest());
		return dao.findPage(page, ht);
	}

	public Role getByName(String name) {
		return (Role) getSession().createQuery("from Role where name=?")
				.setString(0, name).uniqueResult();
	}

	public List<Role> getRolesByUser(User user) {
		String roleIds = user.getRoleList();
		if (roleIds == null || roleIds.equals(""))
			return new ArrayList<Role>();
		while (roleIds.indexOf(",") == 0) {
			roleIds = roleIds.substring(1);
		}
		while (roleIds.lastIndexOf(",") == (roleIds.length() - 1)) {
			roleIds = roleIds.substring(0, roleIds.length() - 1);
		}
		return dao.find("from Role where valid = true and id in (" + roleIds + ")");
	}

	public List<Long> getFunctionIdsByRoleId(Long roleId) {
		List<Long> idList = new ArrayList<Long>();
		Role role = get(roleId);
		String funtions = role.getFunctionList();
		if (funtions == null || funtions.equals("")) {
			return idList;
		}
		String[] funcIds = funtions.split(",");
		for (String funcId : funcIds) {
			if (funcId.equals(""))
				continue;
			idList.add(Long.parseLong(funcId));
		}
		return idList;
	}

	/**
	 * 判断role有没有分配给用户 ,如果分配了返回true，否则返回false
	 * 
	 * @param roleId
	 * @return
	 */
	public boolean isRoleDispatched(Long roleId) {
		List<User> list = dao.find("from User where roleList  like ?", "%,"
				+ roleId.toString() + ",%");
		if (list != null && list.size() > 0) {
			return true;
		}
		return false;
	}

}
