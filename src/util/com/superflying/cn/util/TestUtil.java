package com.superflying.cn.util;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import com.superflying.cn.driver.dao.TestDao;

public class TestUtil {
	public static TestDao testDao;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		TestUtil test = new TestUtil();
		Class<?> clazz = test.getClass();
		Type type = clazz.getGenericSuperclass();
		System.out.println(clazz);
		System.out.println(type);
		if (type instanceof ParameterizedType) {
			System.out.println("----------");
		}
	}

}
