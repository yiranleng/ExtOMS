package com.superflying.cn.driver.dao.test;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.test.TestTree;

@Service
@Transactional(readOnly = true)
public class TestTreeDao extends BaseDao<TestTree> {
	
	public List<TestTree> find() {
		return dao.find("from TestTree order by id");
	}
	
	public List<TestTree> findByParentId(Long parentId) {
		if(null == parentId){
			return dao.find("from TestTree t where t.parentId is null order by id");
		}else{
			return dao.find("from TestTree t where t.parentId=? order by id",parentId);
		}
	}

}
