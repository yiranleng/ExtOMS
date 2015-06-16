package com.superflying.cn.driver.base;

import java.io.Serializable;

import javax.persistence.MappedSuperclass;


@MappedSuperclass
public class BaseEntity<PK extends Serializable> extends IdEntity<PK> {
	private static final long serialVersionUID = 1L;
}
