package com.superflying.cn.driver.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;


/**
 * @author wuxiaoxu
 */
@MappedSuperclass
public abstract class IdEntity<PK extends Serializable> implements Persistable<PK>, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_")
    protected PK id;

    public void setId(PK id) {
		this.id = id;
	}

	@Override
    public PK getId() {
        return id;
    }

    @Override
    @Transient
    public boolean isNew() {
        return null == getId();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        IdEntity idEntity = (IdEntity) o;

        if (!id.equals(idEntity.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
