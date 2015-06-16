/*
Navicat MySQL Data Transfer
Source Host     : localhost:3306
Source Database : extoms
Target Host     : localhost:3306
Target Database : extoms
Date: 2013-08-01 22:22:06
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for app_user
-- ----------------------------
DROP TABLE IF EXISTS `app_user`;
CREATE TABLE `app_user` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT,
  `name_` varchar(30) DEFAULT NULL,
  `password_` varchar(50) DEFAULT NULL,
  `name_ch` varchar(20) DEFAULT NULL,
  `role_list` varchar(100) DEFAULT NULL,
  `function_list` varchar(200) DEFAULT NULL,
  `phone_` varchar(20) DEFAULT NULL,
  `preference_id` bigint(20) DEFAULT NULL,
  `is_valid` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of app_user
-- ----------------------------
INSERT INTO `app_user` VALUES ('1', 'admin', 'admin', '超级管理员', null, ',1,', '', '9', '1');
INSERT INTO `app_user` VALUES ('2', 'wuxiaoxu', 'wuxiaoxu', '武晓旭', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('3', 'shengchong', 'shengchong', '盛冲', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('8', '1111111111', '1111111111', '阿斯蒂芬', null, null, '111111', '10', '1');
INSERT INTO `app_user` VALUES ('11', '111', '11111', '斯蒂芬', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('10', '11', '11111', '发送', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('12', 'asdf', '11111', '发送', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('13', 'fds', '11111', '是', null, null, '', null, '0');
INSERT INTO `app_user` VALUES ('14', 'as', '11111', '艾丝凡', null, null, '', null, '0');
INSERT INTO `app_user` VALUES ('15', 'asdff', '11111', '飞', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('16', 'asdfsdf', '11111', '发送', null, null, '', null, '1');
INSERT INTO `app_user` VALUES ('17', 'asfdfasf', '11111', '阿斯蒂芬', null, null, '', null, '1');

-- ----------------------------
-- Table structure for function
-- ----------------------------
DROP TABLE IF EXISTS `function`;
CREATE TABLE `function` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT,
  `name_` varchar(50) NOT NULL,
  `code_` varchar(50) NOT NULL,
  `is_valid` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of function
-- ----------------------------
INSERT INTO `function` VALUES ('1', 'A', 'RES_A', '1');
INSERT INTO `function` VALUES ('2', 'B', 'RES_B', '1');
INSERT INTO `function` VALUES ('3', 'C', 'RES_C', '1');
INSERT INTO `function` VALUES ('4', 'D', 'RES_D', '1');

-- ----------------------------
-- Table structure for preference
-- ----------------------------
DROP TABLE IF EXISTS `preference`;
CREATE TABLE `preference` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT,
  `background_color` varchar(20) DEFAULT NULL,
  `font_color` varchar(20) DEFAULT NULL,
  `transparency_` varchar(20) DEFAULT NULL,
  `theme_id` varchar(20) DEFAULT NULL,
  `wallpaper_id` varchar(20) DEFAULT NULL,
  `wallpaper_position` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of preference
-- ----------------------------
INSERT INTO `preference` VALUES ('9', '390A0A', 'FFFFFF', '100', '7', '8', 'center');
INSERT INTO `preference` VALUES ('10', '390A0A', 'FFFFFF', '100', '7', '5', 'center');
INSERT INTO `preference` VALUES ('11', '390A0A', 'FFFFFF', '100', '7', '16', 'center');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT,
  `name_` varchar(50) NOT NULL,
  `function_list` varchar(500) NOT NULL,
  `is_valid` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '测试角色', ',3,4,', '1');

-- ----------------------------
-- Table structure for sysmenu
-- ----------------------------
DROP TABLE IF EXISTS `sysmenu`;
CREATE TABLE `sysmenu` (
  `id_` bigint(20) NOT NULL,
  `parent_name` varchar(20) DEFAULT NULL,
  `name_` varchar(20) NOT NULL,
  `title_` varchar(50) NOT NULL,
  `description_` varchar(50) DEFAULT NULL,
  `tooltip_` varchar(50) DEFAULT NULL,
  `mpage_` varchar(50) DEFAULT NULL,
  `width_` varchar(10) DEFAULT NULL,
  `height_` varchar(10) DEFAULT NULL,
  `menu_type` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sysmenu
-- ----------------------------
INSERT INTO `sysmenu` VALUES ('5', 'SystemManage', 'SeceryManager', '安全管理', '安全管理', '安全管理', '', '', '', '');
INSERT INTO `sysmenu` VALUES ('1', '', 'DailyManager', '日常管理', '日常管理', '日常管理', '', '', '', '');
INSERT INTO `sysmenu` VALUES ('7', 'SeceryManager', 'UserManage', '用户管理', '用户管理', '用户管理', '/user/home', '800', '500', '1');
INSERT INTO `sysmenu` VALUES ('2', '', 'SystemManage', '系统管理', '系统管理', '系统管理', '', '', '', '');
INSERT INTO `sysmenu` VALUES ('4', 'SystemManage', 'borderTest', '测试', '测试', '测试', 'treePaneldiv.do', '800', '500', '1');
INSERT INTO `sysmenu` VALUES ('6', 'DailyManager', 'emailManage', '发送邮件', '发送邮件', '发送邮件', '/email/home', '600', '337', '1');
INSERT INTO `sysmenu` VALUES ('3', 'SystemManage', 'DatabaseBackup', '数据库备份', '数据库备份', '数据库备份', 'databaseBackup.do', '800', '500', '1');
INSERT INTO `sysmenu` VALUES ('8', 'SystemManage', 'JobManagerWin', '任务调度管理', '任务调度管理', '任务调度管理', 'JobManager.do', '800', '500', '1');

-- ----------------------------
-- Table structure for theme
-- ----------------------------
DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme` (
  `id_` bigint(20) NOT NULL,
  `name_` varchar(50) DEFAULT NULL,
  `path_thumb_nail` varchar(100) DEFAULT NULL,
  `path_file` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of theme
-- ----------------------------
INSERT INTO `theme` VALUES ('7', '默认', '/scripts/ext/desktop/themes/ext.gif', '/scripts/ext/resources/css/xtheme-yourtheme.css');
INSERT INTO `theme` VALUES ('1', '黑色', '/scripts/ext/desktop/themes/xtheme-vistablack/xtheme-vistablack.png', '/scripts/ext/desktop/themes/xtheme-vistablack/css/xtheme-vistablack.css');
INSERT INTO `theme` VALUES ('2', '淡蓝', '/scripts/ext/desktop/themes/xtheme-vistablue/xtheme-vistablue.png', '/scripts/ext/desktop/themes/xtheme-vistablue/css/xtheme-vistablue.css');
INSERT INTO `theme` VALUES ('3', '玻璃', '/scripts/ext/desktop/themes/xtheme-vistaglass/xtheme-vistaglass.png', '/scripts/ext/desktop/themes/xtheme-vistaglass/css/xtheme-vistaglass.css');
INSERT INTO `theme` VALUES ('4', '白色', '/scripts/ext/desktop/themes/xtheme-gray.jpg', '/scripts/ext/resources/css/xtheme-gray.css');
INSERT INTO `theme` VALUES ('5', '蓝色', '/scripts/ext/desktop/themes/ext.gif', '/scripts/ext/resources/css/xtheme-blue.css');
INSERT INTO `theme` VALUES ('6', '深蓝', '/scripts/ext/desktop/themes/xtheme-indigo.jpg', '/scripts/ext/resources/css/xtheme-access.css');

-- ----------------------------
-- Table structure for user_menu
-- ----------------------------
DROP TABLE IF EXISTS `user_menu`;
CREATE TABLE `user_menu` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `menu_name` varchar(50) NOT NULL,
  `desktop_show` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_menu
-- ----------------------------
INSERT INTO `user_menu` VALUES ('2', '4', 'UserManage', '0');
INSERT INTO `user_menu` VALUES ('3', '4', 'DatabaseBackup', '0');
INSERT INTO `user_menu` VALUES ('4', '4', 'emailManage', '0');
INSERT INTO `user_menu` VALUES ('5', '3', 'DatabaseBackup', '0');
INSERT INTO `user_menu` VALUES ('29', '1', 'DatabaseBackup', '1');
INSERT INTO `user_menu` VALUES ('28', '1', 'JobManagerWin', null);
INSERT INTO `user_menu` VALUES ('8', '2', 'border', '1');
INSERT INTO `user_menu` VALUES ('27', '1', 'borderTest', '1');
INSERT INTO `user_menu` VALUES ('26', '1', 'emailManage', '1');
INSERT INTO `user_menu` VALUES ('25', '1', 'UserManage', '1');
INSERT INTO `user_menu` VALUES ('65', '8', 'DatabaseBackup', '1');
INSERT INTO `user_menu` VALUES ('61', '8', 'UserManage', '1');
INSERT INTO `user_menu` VALUES ('64', '8', 'JobManagerWin', '1');

-- ----------------------------
-- Table structure for wallpaper
-- ----------------------------
DROP TABLE IF EXISTS `wallpaper`;
CREATE TABLE `wallpaper` (
  `id_` bigint(20) NOT NULL,
  `name_` varchar(50) DEFAULT NULL,
  `path_thumb_nail` varchar(100) DEFAULT NULL,
  `path_file` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wallpaper
-- ----------------------------
INSERT INTO `wallpaper` VALUES ('1', 'opms1', '/scripts/ext/desktop/wallpapers/thumbnails/oms1.jpg', '/scripts/ext/desktop/wallpapers/oms1.jpg');
INSERT INTO `wallpaper` VALUES ('2', 'opms2', '/scripts/ext/desktop/wallpapers/thumbnails/oms2.jpg', '/scripts/ext/desktop/wallpapers/oms2.jpg');
INSERT INTO `wallpaper` VALUES ('3', 'oms3', '/scripts/ext/desktop/wallpapers/thumbnails/oms3.jpg', '/scripts/ext/desktop/wallpapers/oms3.jpg');
INSERT INTO `wallpaper` VALUES ('4', 'oms4', '/scripts/ext/desktop/wallpapers/thumbnails/oms4.jpg', '/scripts/ext/desktop/wallpapers/oms4.jpg');
INSERT INTO `wallpaper` VALUES ('5', 'oms5', '/scripts/ext/desktop/wallpapers/thumbnails/oms5.jpg', '/scripts/ext/desktop/wallpapers/oms5.jpg');
INSERT INTO `wallpaper` VALUES ('6', 'oms6', '/scripts/ext/desktop/wallpapers/thumbnails/oms6.jpg', '/scripts/ext/desktop/wallpapers/oms6.jpg');
INSERT INTO `wallpaper` VALUES ('7', 'oms7', '/scripts/ext/desktop/wallpapers/thumbnails/oms7.jpg', '/scripts/ext/desktop/wallpapers/oms7.jpg');
INSERT INTO `wallpaper` VALUES ('8', 'oms8', '/scripts/ext/desktop/wallpapers/thumbnails/oms8.jpg', '/scripts/ext/desktop/wallpapers/oms8.jpg');
INSERT INTO `wallpaper` VALUES ('9', 'oms9', '/scripts/ext/desktop/wallpapers/thumbnails/oms9.jpg', '/scripts/ext/desktop/wallpapers/oms9.jpg');
INSERT INTO `wallpaper` VALUES ('15', 'oms15', '/scripts/ext/desktop/wallpapers/thumbnails/oms15.jpg', '/scripts/ext/desktop/wallpapers/oms15.jpg');
INSERT INTO `wallpaper` VALUES ('16', 'oms16', '/scripts/ext/desktop/wallpapers/thumbnails/oms16.jpg', '/scripts/ext/desktop/wallpapers/oms16.jpg');
INSERT INTO `wallpaper` VALUES ('17', 'oms17', '/scripts/ext/desktop/wallpapers/thumbnails/oms17.jpg', '/scripts/ext/desktop/wallpapers/oms17.jpg');
INSERT INTO `wallpaper` VALUES ('10', 'oms10', '/scripts/ext/desktop/wallpapers/thumbnails/oms10.jpg', '/scripts/ext/desktop/wallpapers/oms10.jpg');
INSERT INTO `wallpaper` VALUES ('11', 'oms11', '/scripts/ext/desktop/wallpapers/thumbnails/oms11.jpg', '/scripts/ext/desktop/wallpapers/oms11.jpg');
INSERT INTO `wallpaper` VALUES ('12', 'oms12', '/scripts/ext/desktop/wallpapers/thumbnails/oms12.jpg', '/scripts/ext/desktop/wallpapers/oms12.jpg');
INSERT INTO `wallpaper` VALUES ('13', 'oms13', '/scripts/ext/desktop/wallpapers/thumbnails/oms13.jpg', '/scripts/ext/desktop/wallpapers/oms13.jpg');
INSERT INTO `wallpaper` VALUES ('14', 'oms14', '/scripts/ext/desktop/wallpapers/thumbnails/oms14.jpg', '/scripts/ext/desktop/wallpapers/oms14.jpg');
