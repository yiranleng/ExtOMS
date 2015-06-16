package com.superflying.cn.driver.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.Function;
import com.superflying.cn.driver.bean.sys.User;
import com.superflying.cn.util.CommonUtil;

/**
 * 功能权限service
 * @author wuxiaoxu 20130719
 */
@Service
@Transactional(readOnly = true)
public class FunctionDao extends BaseDao<Function> {
	
	/**
	 * 得到所有有效的功能列表
	 * @return
	 */
	public List<Function> findFunctions() {
//		return dao.find("from Function where valid=true order by order");
		return dao.find("from Function where valid=true order by id_");
	}

	/**
	 * @param code
	 * @return
	 */
	public Function getByCode(String code) {
		return (Function) dao.createQuery("from Function where code=?",code)
				.uniqueResult();
	}

	/**
	 * 只是获取为用户单独分配的功能
	 * @param userId
	 * @return
	 */
//	public List<Long> getFunctionIdsByUser(User user){
//		List<Long> idList = new ArrayList<Long>();
//		String funtions = user.getFunctionList();
//		if(StringUtils.isBlank(funtions)) return idList;
//		String[] funcIds = funtions.split(",");
//		for(String funcId:funcIds){
//			if("".equals(funcId))continue;
//			idList.add(Long.parseLong(funcId));
//		}
//		return idList;
//	}
	
	/**
	 * 获取指定用户功能权限列表 
	 * wuxiaoxu test此函数应该放在 functionDao中
	 * @param user
	 * @return
	 */
	public List<Function> getFunctionList(User user) {
//		List<Long> idList = getFunctionIdsByUser(user);
		List<Long> idList = getUserAndRoleFunctionIdList(user);
		if (CommonUtil.isEmpty(idList)){
			return new ArrayList<Function>();
		}
		String hql = "from Function where id in (" + idList.toString().replace('[', ' ').replace(']', ' ') + ") and valid=true";
		return dao.find(hql);		
	}
	
	/**
	 * 得到几个角色总共所有的功能，可能重复。
	 * @param roleIds
	 * @return 格式为“,id1,id2,id3,”   其中id可以重复，可以连续逗号
	 */
	public String getFunctionsByRoleIds(String roleIds){
		while (roleIds.indexOf(",")==0){
			roleIds = roleIds.substring(1);
		}
		while (roleIds.lastIndexOf(",")==(roleIds.length()-1)){
			roleIds = roleIds.substring(0,roleIds.length()-1);
		}
		//oracle: wm_concat  mysql:group_concat
		String sql = "select group_concat(ur.function_list) from role ur where ur.is_valid='1' and ur.id_ in ("+roleIds+")";
		return (String)getSession().createSQLQuery(sql).uniqueResult();
	}
	
	/**
	 * 获取用户功能列表
	 * 原则：用户所属角色功能和用户单独分配功能组合
	 * 
	 * @param user
	 * @return
	 */
	public List<Long> getUserAndRoleFunctionIdList(User user) {
		List<Long> functionList = new ArrayList<Long>();
		String roles = user.getRoleList();
		String userAllFuns = user.getFunctionList();
		userAllFuns = CommonUtil.isNotEmpty(userAllFuns) ? userAllFuns : "";
		String roleFuns = "";// 角色对应的权限
		if (CommonUtil.isNotEmpty(roles)) {
			while (roles.indexOf(",") == 0) {
				roles = roles.substring(1);
			}
			while (roles.lastIndexOf(",") == (roles.length() - 1)) {
				roles = roles.substring(0, roles.length() - 1);
			}
			// 把用户所有角色的功能拼接起来
			String sql = "select group_concat(t.function_list) from role t where t.is_valid = '1' and t.id_ in (" + roles + ")";
			roleFuns = (String) getSession().createSQLQuery(sql).uniqueResult();
		}
		userAllFuns += roleFuns;
		if (CommonUtil.isNotEmpty(userAllFuns)) {
			String[] funs = userAllFuns.split(",");
			if (CommonUtil.isNotEmpty(funs)) {
				for (String functionId : funs) {
					if (CommonUtil.isNotEmpty(functionId) && !functionList.contains(Long.parseLong(functionId))) {
						functionList.add(Long.parseLong(functionId));
					}
				}
			}
		}
		return functionList;
	}
	
//	/**
//	 * 获取分配了指定角色的用户列表
//	 * @param roleId
//	 * @return
//	 */
//	public List<User> getUserByRoleId(Long roleId) {
//		List<User> list = dao.find(
//				"from User where roleList  like ?",
//				"%," + roleId.toString() + ",%");
//		return list;
//	}
	
}
