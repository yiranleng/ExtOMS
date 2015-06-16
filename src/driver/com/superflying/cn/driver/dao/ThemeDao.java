package com.superflying.cn.driver.dao;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.Theme;

/**
 * 主题相关
 * @author wuxiaoxu 20130719
 */
@Service
@Transactional(readOnly = true)
public class ThemeDao extends BaseDao<Theme> {
	
	public List<Theme> find() {
		return dao.find("from Theme");
	}
}
