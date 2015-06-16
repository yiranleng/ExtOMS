package com.superflying.cn.driver.base;

import java.io.Serializable;
import java.util.Date;


/**
 * @author wuxiaoxu
 * copy from  spring data jpa
 */
public interface Editable<U, ID extends Serializable> extends Persistable<ID> {

    U getCreatedBy();

    void setCreatedBy(U createdBy);

    Date getCreatedDate();

    void setCreatedDate(final Date createdDate);

    U getLastModifiedBy();

    void setLastModifiedBy(U lastModifiedBy);

    Date getLastModifiedDate();

    void setLastModifiedDate(final Date lastModifiedDate);

}
