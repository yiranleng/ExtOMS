package com.superflying.cn.driver.dao;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.superflying.cn.driver.base.BaseDao;
import com.superflying.cn.driver.bean.sys.Preference;

/**
 * @author wuxiaoxu 20130718
 * see 用户Dao
 */
@Service
@Transactional(readOnly=true)
public class PreferencesDao extends BaseDao<Preference> {
	
	@Transactional
	public void update(Preference preference) {
		dao.update(preference);
	}
	
//	public Preference findById(Long id) {
//		return (Preference) dao.createQuery("from Preference where id = ?", id).uniqueResult();
//	}
	
//	public ThemeWallPaper getThemeAndWallPaper(Long preferenceId) {
//		
//		String sql = " select  p.background_color backgroundColor,p.font_color fontColor,p.transparency_ transparency,p.wallpaper_position wallpaperPosition,p.theme_id themeId,p.wallpaper_id wallpaperId," +
//					 " t.name_ themeName,	t.path_file themePathFile," + 
//					 " w.name_ wallpaperName,	w.path_file wallpaperPathFile " +
//					 " from preference p,    theme t,   wallpaper w " +
//					 " where p.id_ = ? and p.theme_id = t.id_ and p.wallpaper_id = w.id_";
////		return (ThemeWallPaper) getSession().createSQLQuery(sql).addEntity(ThemeWallPaper.class).uniqueResult();
//		return (ThemeWallPaper) getSession().createSQLQuery(sql).setResultTransformer(
//				Transformers.aliasToBean(ThemeWallPaper.class)).setLong(0, preferenceId).uniqueResult();
//	}

}
