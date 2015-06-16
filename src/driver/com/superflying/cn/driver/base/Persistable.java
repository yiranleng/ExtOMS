package com.superflying.cn.driver.base;

import java.io.Serializable;

/**
 * @author wuxiaoxu
 */
public interface Persistable<ID extends Serializable> extends Serializable {

    /**
     * Returns the id of the entity.
     *
     * @return the id
     */
    ID getId();


    /**
     * Returns if the {@code Persistable} is new or was persisted already.
     *
     * @return if the object is new
     */
    boolean isNew();
}
