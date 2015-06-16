package cn.superflying.oms.webapp.taglib;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;


/** 
 * @author wuxiaoxu  20120811
 * @����   EXT���湤�߼����ط�����
 */

public class OmTagUtils {
	
	/**
	 * @author wuxiaoxu 20120811 add
	 * @see �ļ����ع��߷���
	 */
	public static void downloadFile( HttpServletResponse response,String fileName,String filePath){
		File tmpFile = new File(filePath);
		if(!tmpFile.exists()){ 
			System.out.println("---------���صĵ����ļ�������---------");
			response.setContentType("text/html;charset=UTF-8");
			try {
				response.getWriter().print("��ʾ�������صĵ����ļ�����������ϵ����Ա��");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;//wuxiaoxu 20111116����ļ������� ֱ�����䷵�� �պ�Ӧ������Ϣ
		}
		tmpFile = null;
		try{
			fileName = URLEncoder.encode(fileName,"utf-8") ;
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=\"" +fileName+"\"");
			response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");   
			response.setHeader("Pragma", "public"); 
			response.setDateHeader("Expires", (System.currentTimeMillis() + 1000)); 
			ServletOutputStream out = response.getOutputStream();
//			BufferedReader br=new BufferedReader(new FileReader(filePath));//wuxiaoxu 20111116 ����ǳԱ��ŵİ�������
			InputStream inStream = new FileInputStream(filePath);
			int line= 0 ;
			byte[] buf = new byte[8192];
			while ((line = inStream.read(buf,0,8192)) != -1){
				out.write(buf, 0, line);
			}
			out.close();
//			br.close();
			inStream.close();
		}
		catch (Exception e){
//			System.out.println(e);
			e.printStackTrace();
		}
	}
	
//	ext ����column
	public final static String getJsonRecord(List<String> tags){
		StringBuffer records  = new StringBuffer();
		records.append("[");
		int i=0;
		for(String tempStr:tags){
			i++;
			if("id".equals(tempStr)){
				if(i==tags.size()){
					records.append("{'name':'"+tempStr+"',type:'int'}");
				}else{
					records.append("{'name':'"+tempStr+"',type:'int'},");
				}
			}else{
				if(i==tags.size()){
					records.append("{'name':'"+tempStr+"' }");
				}else{
					records.append("{'name':'"+tempStr+"' },");
				}
			}
		}
		records.append("]");
		return records.toString();
	}
}
