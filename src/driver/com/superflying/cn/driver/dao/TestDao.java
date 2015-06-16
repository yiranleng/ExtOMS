package com.superflying.cn.driver.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.Terminal;

/**
 * 终端设备service
 * 
 * @author wuxiaoxu
 */
@Repository
@Transactional(readOnly = true)
public class TestDao extends BaseDao<Terminal> {
	
	
	public TestDao(){
		System.out.println();
		System.out.println();
	}
	

	public List<Terminal> find() {
		return dao.find("from Terminal");
	}

	/**
	 * 批量导入保存终端号码
	 * 
	 * @param terminalList
	 */
	@Transactional
	public void save(List<Terminal> terminalList) {
		for (Terminal tml : terminalList) {
			if (null != tml) {
				this.save(tml);
			}
		}
	}

	/**
	 * wuxiaoxu 20130111 add
	 * 
	 * @param terminalList
	 */
	@Transactional
	public void update(Terminal terminal) {
		this.dao.update(terminal);
	}
	
	//wuxiaoxu 分页查询
	public void test(){
		Query q = dao.createQuery("from Terminal as c where id > 53987");;  
		q.setFirstResult(0);; 
		q.setMaxResults(10);;  
		List l = q.list();
		System.out.println(l);
	}

}