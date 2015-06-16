package cn.superflying.oms.webapp.taglib;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;

import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

public class BaseTag extends TagSupport {

	private static final long serialVersionUID = -6604848676611820031L;

	private WebApplicationContext wac = ContextLoader
			.getCurrentWebApplicationContext();

	public Object getBean(String beanName) {
		return wac.getBean(beanName);
	}

	/**
	 * @author wuxiaoxu 20130721 add
	 * @description
	 * @param buffer
	 * @throws JspException
	 */
	public void writeBuffer(StringBuffer buffer){
		this.write(buffer.toString());
	}

	/**
	 * @author wuxiaoxu 20130721 add
	 * @description
	 * @param buffer
	 * @throws JspException
	 */
	public void write(String str){
		try {
			JspWriter writer = pageContext.getOut();
			writer.print(str);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
