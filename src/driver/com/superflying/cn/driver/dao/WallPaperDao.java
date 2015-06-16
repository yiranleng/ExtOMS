package com.superflying.cn.driver.dao;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.WallPaper;

/**
 * 主题相关
 * @author wuxiaoxu 20130719
 */
@Service
@Transactional(readOnly = true)
public class WallPaperDao extends BaseDao<WallPaper> {
	
	public List<WallPaper> find() {
		return dao.find("from WallPaper");
	}
}
