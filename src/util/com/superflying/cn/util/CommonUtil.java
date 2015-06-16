package com.superflying.cn.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.commons.mail.MultiPartEmail;
import org.apache.commons.mail.SimpleEmail;


public class CommonUtil {

	private final static DecimalFormat nf = new DecimalFormat("#####0.00");


	/**
	 * 针对要求精确4位小数
	 */
	public final static DecimalFormat nf4 = new DecimalFormat("#####0.0000");

	private final static String NULL_STRING = "";

	/**
	 * 为2个标准的java bean对象复制属性
	 * 只所以替换PropertyUtils.copyProperties方法是因为要对对象的属性描述符进行缓存，以提高速度
	 * 
	 * @param dest
	 *            目标对象
	 * @param origin
	 *            源对象
	 */
//	private static Class[] ac = { Long.class, Long.TYPE, Boolean.class,
//			Boolean.TYPE, Integer.class, Integer.TYPE, Byte.class, Byte.TYPE,
//			String.class, Date.class, java.sql.Date.class, Timestamp.class,
//			BigDecimal.class, Float.class, Float.TYPE, Double.class,
//			Double.TYPE };

//	private static HashSet propertyTypesForCopy = new HashSet(Arrays.asList(ac));


	/**
	 * 将Object对象转变为String类型对象，对于null值返回空字符串.
	 * 
	 * @param s
	 *            待处理的对象.
	 */
	public static String killNull(Object o, String ds) {
		if (o instanceof String) {
			return killNull(o, ds);
		} else if (o instanceof Double) {
			return killNull((Double) o, ds);
		} else {
			return o != null ? o.toString() : ds;
		}
	}

	public static String killNull(Object o) {
		return killNull(o, NULL_STRING);
	}

	public static String killNull(Double o, String ds) {
		if (o != null) {
			return nf.format(o);
		} else {
			return ds;
		}
	}

	public static String killNull(Double o) {
		return killNull(o, NULL_STRING);
	}

	public static String killNull(double o) {
		if (o != 0) {
			return nf.format(o);
		} else {
			return NULL_STRING;
		}
	}

	public static String killNull(BigDecimal o) {
		return killNull(o, NULL_STRING);
	}

	public static String killNull(BigDecimal o, DecimalFormat df) {
		if (o == null) {
			return NULL_STRING;
		}

		return nf4.format(o.doubleValue());
	}

	public static String killNull(BigDecimal o, String nullString) {
		if (o != null) {
			return nf.format(o.doubleValue());
		}
		if (NULL_STRING.equals(nullString)) {
			return "";
		} else {
			return "0";
		}
	}

	public static String killNull(long o) {
		return String.valueOf(o);
	}

	public static String killNull(Long o) {
		return o == null ? NULL_STRING : String.valueOf(o);
	}

	/**
	 * 判断字符串中是否全部是数字，如是则返回true，否则则返回为false。
	 * 
	 * @param str
	 *            需判断的字符串
	 */
	public static boolean isNumber(String str) {
		try {
			if (isEmpty(str)) {
				return false;
			}
			new Double(str);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	/**
	 * 在字符串前补0，使它的长度达到len指定的长度
	 */
	public static String toStr(String s, int len) {
		if (s == null) {
			s = "";
		} else {
			s = s.trim();
		}
		return StringUtils.repeat("0", len - s.length()) + s;
	}

	public static String toStr(long n, int len) {
		String s = Long.toString(n);
		return StringUtils.repeat("0", len - s.length()) + s;
	}

	/**
	 * 左补位
	 * 
	 * @param s
	 *            字符串
	 * @param n
	 *            补几位
	 * @param regex
	 *            补位字符
	 * @author 黑山老妖
	 * @return
	 */
	public static String leftPad(String s, int n, String regex) {
		return StringUtils.leftPad(s, s.length() + n, regex);
	}

	public static String leftPad(String s, int n, char regex) {
		return StringUtils.leftPad(s, s.length() + n, regex);
	}

	/**
	 * 右补位
	 * 
	 * @param s
	 *            字符串
	 * @param n
	 *            补几位
	 * @param regex
	 *            补位字符
	 * @return
	 */
	public static String rightPad(String s, int n, String regex) {
		return StringUtils.rightPad(s, s.length() + n, regex);
	}

	public static String rightPad(String s, int n, char regex) {
		return StringUtils.rightPad(s, s.length() + n, regex);
	}

	/**
	 * 从数据库字段名得到java变量的名字,规则：去掉词间下划线分隔符，改变大小写 例如，将CUSTMER_INFO转换成custmerInfo
	 * 
	 * @param columnName
	 *            字段名
	 * @return 变量名字 OK
	 */
	static public String fieldName2varName(String columnName) {
		return fieldName2varName(columnName, "_");
	}

	/**
	 * 从数据库字段名得到java变量的名字,规则：去掉词间下划线分隔符，改变大小写
	 * <p>
	 * 例如，将CUSTMER_INFO转换成custmerInfo或CUSTMER-INFO转换成custmerInfo或
	 * 
	 * @author 黑山老妖
	 * @param columnName
	 *            字段名
	 * @param regex
	 *            分隔符
	 * @return 变量名字 OK
	 */
	static public String fieldName2varName(String columnName, String regex) {
		String controlName = "";
		String temp = null;
		if (columnName.indexOf(regex) < 0) {
			return columnName;
		}
		StringTokenizer st = new StringTokenizer(columnName, regex);
		if (st.hasMoreTokens()) {
			controlName = st.nextToken().toLowerCase();
		}
		while (st.hasMoreTokens()) {
			temp = st.nextToken().toLowerCase();
			controlName += temp.substring(0, 1).toUpperCase()
					+ temp.substring(1, temp.length());
		}
		return controlName;
	}

	static public String varName2fieldName(String varName) {
		return varName2fieldName(varName, "_");
	}

	/**
	 * 从java变量的名字得到数据库字段名,规则：添加词间分隔符，改变大小写
	 * <p>
	 * 例如，custmerInfo转成custmer_info或custmer-info
	 * 
	 * @author 黑山老妖
	 * @param varName
	 *            java变量名
	 * @param regex
	 *            分隔符
	 * @return 字段名 OK
	 */
	static public String varName2fieldName(String varName, String regex) {
		char[] temp = varName.toCharArray();
		String filedName = "";
		String[] index = new String[5];// 5个应该够了
		for (int i = 0, j = 0; i < temp.length; i++) {
			if (Character.isUpperCase(temp[i])) {
				index[j] = String.valueOf(temp[i]);
				j++;
			}
		}
		String[] strArray = varName.split("[A-Z]");
		for (int i = 0; i < strArray.length; i++) {
			if (i != strArray.length - 1) {
				filedName += strArray[i] + regex + index[i].toLowerCase();
			} else {
				filedName += strArray[i];
			}
		}
		return filedName;
	}

	// 这个方法可以将String数组转换成用逗号隔开的字符串
	// String delimiter为指定的分隔符
	public static String strArrayToString(String[] needtoTrans, String delimiter) {
		return list2String(Arrays.asList(needtoTrans), delimiter);
	}

	/**
	 * 
	 * @param list
	 * @param seperator
	 * @return
	 */
	public static String list2String(List list, String seperator) {
		if (list == null || list.size() == 0) {
			return "";
		} else {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < list.size(); i++) {
				if (i != 0) {
					sb.append(seperator);
				}
				sb.append(list.get(i));
			}
			return sb.toString();
		}
	}

	/**
	 * 判断是否为空
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(Object emptyObect) {
		boolean result = true;
		if (emptyObect == null) {
			return true;
		}
		if (emptyObect instanceof String) {
			result = emptyObect.toString().trim().length() == 0
					|| emptyObect.toString().trim().equals("null");
		} else if (emptyObect instanceof Collection) {
			result = ((Collection) emptyObect).size() == 0;
		} else {
			result = emptyObect == null
					|| emptyObect.toString().trim().length() < 1 ? true : false;
		}
		return result;
	}

	public static boolean isNotEmpty(Object str) {
		return !isEmpty(str);
	}

	public static String getStringParamValue(HttpServletRequest request,
			String key, String defaultValue) {
		Object value = request.getParameter(key);
		if (value == null) {
			value = request.getAttribute(key);
		}
		if (value != null) {
			return value.toString();
		} else {
			return defaultValue;
		}
	}

	public static String getStringParamValue(HttpServletRequest request,
			String key) {
		return getStringParamValue(request, key, null);
	}

	public static StringBuffer setVar(StringBuffer temp, String name, long value) {
		return setVar(temp, name, String.valueOf(value));
	}

	public static StringBuffer setVar(StringBuffer temp, String name,
			String value) {
		return setVar(temp, name, (Object) value);
	}

	public static StringBuffer setVar(StringBuffer temp, String name,
			Object value) {
		if (temp == null || name == null) {
			return temp;
		}
		if (value == null || value.toString().length() == 0) {
			value = "";
		}
		int start = temp.indexOf(name);
		if (start < 0) {
			return temp;
		}
		return temp.replace(start, start + name.length(), value.toString());
	}

	public static String[] split(String source, String separator) {
		if (isEmpty(source)) {
			return new String[1];
		}
		source = source.trim();
		if (source.indexOf(separator) >= 0
				&& source.split(separator).length == 0) {
			String[] result = new String[source.length() + 1];
			for (int i = 0, n = source.length() + 1; i < n; i++) {
				result[i] = "";
			}
			return result;
		} else {
			return source.split(separator);
		}
	}

	public static Long[] stringToLong(String[] args, Long defaultValue) {
		if (args == null) {
			return null;
		}
		Long longs[] = new Long[args.length];
		for (int i = 0, n = args.length; i < n; i++) {
			longs[i] = isEmpty(args[i]) ? defaultValue : Long.valueOf(args[i]);
		}
		return longs;
	}

	public static long[] stringTolong(String[] args) {
		if (args == null) {
			return null;
		}
		long longs[] = new long[args.length];
		for (int i = 0, n = args.length; i < n; i++) {
			longs[i] = Long.valueOf(args[i]).longValue();
		}
		return longs;
	}

	public static double[] stringTodouble(String[] args) {
		if (args == null) {
			return null;
		}
		double doubles[] = new double[args.length];
		for (int i = 0, n = args.length; i < n; i++) {
			doubles[i] = Double.valueOf(args[i]).doubleValue();
		}
		return doubles;
	}


	/**
	 * 取当前日期的字符串，格式为"yyyy-mm-dd"
	 */
	public static String getNowDate() {
		Calendar now = Calendar.getInstance();
		return getDateStr(now);
	}

	/**
	 * 判断是否是今天之前
	 * 
	 * @throws ParseException
	 */

	public static boolean ispass(Date date) {
		boolean flag = false;
		Date today = parseDate(getNowDate() + " 00:00:00");
		if (date.getTime() < today.getTime()) {
			flag = true;
		}
		return flag;
	}

	/**
	 * 获取本月第一天和最后一天
	 * 
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static String[] getCurrentMonth() {
		// 当前月的最后一天
		Calendar cal = Calendar.getInstance();
		cal.add(cal.MONTH, 1);
		cal.set(cal.DATE, 1);
		cal.add(cal.DATE, -1);
		String[] currMonth = new String[3];
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String day_end = df.format(cal.getTime());
		// 当前月的第一天
		GregorianCalendar gc = (GregorianCalendar) Calendar.getInstance();
		gc.setTime(new Date());
		gc.set(Calendar.DAY_OF_MONTH, 1);
		String day_first = df.format(gc.getTime());
		currMonth[0] = day_first;
		currMonth[1] = day_end;
		currMonth[2] = cal.getActualMaximum(Calendar.DAY_OF_MONTH)+"";
		return currMonth;
	}
	//获取上个月第一天和最后一天
	public static String[] getLastMonth(){
		Calendar cal = Calendar.getInstance();
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH) + 1;
		cal.set(Calendar.DAY_OF_MONTH, 1);
		cal.add(Calendar.DAY_OF_MONTH, -1);
		int day = cal.get(Calendar.DAY_OF_MONTH);
		
		String months = "";
		String days = "";
		if (month > 1) {
			month--;
		} else {
			year--;
			month = 12;
		}
		if (!(String.valueOf(month).length() > 1)) {
			months = "0" + month;
		} else {
			months = String.valueOf(month);
		}
		if (!(String.valueOf(day).length() > 1)) {
			days = "0" + day;
		} else {
			days = String.valueOf(day);
		}
		
		String[] lastMonth = new String[3];
		String firstDay = "" + year + "-" + months + "-01";
		lastMonth[0] = firstDay;
		
		String lastDay = "" + year + "-" + months + "-" + days;
		lastMonth[1] = lastDay;
		lastMonth[2] = days;
		return lastMonth;
	}
	
	/**
	 * 取当前日期的字符串，格式为"YYYY-MM-DD HH:MI:SS"
	 */
	public static String getNowFullDate() {
		Calendar now = Calendar.getInstance();
		return getDateStr(now) + " " + getHour(now) + ":" + getMinute(now)
				+ ":" + getSecond(now);
	}

	/**
	 * 取比当前日期早day天的字符串，格式为"YYYY-MM-DD"
	 */
	public static String getDateByDay(int day) {
		Date date = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000
				- day * 24 * 60 * 60 * 1000);
		return formatDateDay(date);
	}


	/**
	 * 返回日历的日期字符串（格式："yyyy-mm-dd"）
	 */
	public static String getDateStr(Calendar cal) {
		return getYear(cal) + "-" + getMonth(cal) + "-" + getDay(cal);
	}

	/**
	 * 返回日历的年字符串
	 */
	public static String getYear(Calendar cal) {
		return String.valueOf(cal.get(Calendar.YEAR));
	}

	/**
	 * 返回日历的月字符串(两位)
	 */
	public static String getMonth(Calendar cal) {
		return strLen(String.valueOf(cal.get(Calendar.MONTH) + 1), 2);
	}

	/**
	 * 返回日历的日字符串(两位)
	 */
	public static String getDay(Calendar cal) {
		return strLen(String.valueOf(cal.get(Calendar.DAY_OF_MONTH)), 2);
	}

	/**
	 * 返回日历的时字符串(两位)
	 */
	public static String getHour(Calendar cal) {
		return strLen(String.valueOf(cal.get(Calendar.HOUR_OF_DAY)), 2);
	}

	/**
	 * 返回日历的分字符串(两位)
	 */
	public static String getMinute(Calendar cal) {
		return strLen(String.valueOf(cal.get(Calendar.MINUTE)), 2);
	}

	/**
	 * 返回日历的秒字符串(两位)
	 */
	public static String getSecond(Calendar cal) {
		return strLen(String.valueOf(cal.get(Calendar.SECOND)), 2);
	}

	/**
	 * 在字符串前补0，使它的长度达到len指定的长度
	 */
	public static String strLen(String s, int len) {
		if (s == null) {
			s = "";
		} else {
			s = s.trim();
		}
		int strLen = s.length();
		for (int i = 0; i < len - strLen; i++) {
			s = "0" + s;
		}
		return s;
	}

	/**
	 * 将字符串转换成Timestamp格式
	 * 
	 * @param timeStampStr
	 *            需要转换的子串
	 * @return 时间对象
	 */
	public static Timestamp convertStrToTimestamp(String timeStampStr) {
		Timestamp returnT = null;
		if (timeStampStr != null && !timeStampStr.trim().equals("")) {
			returnT = new Timestamp(parseDate(timeStampStr).getTime());
		}
		return returnT;
	}

	/**
	 * 修改过的电路与修改前的电路做比较，表示出变动过的数据，未考虑非String属性
	 * 
	 * @param obj1
	 * @param obj2
	 * @param isNull
	 * @return
	 */
	public static String getModifiedValue(Object newValue, Object oldValue,
			boolean isNull) {
		String str1 = newValue == null ? " " : CommonUtil.killNull(newValue);
		String str2 = oldValue == null ? " " : CommonUtil.killNull(oldValue);
		if (isNull) {
			return str1; // 没有老电路，不用做比较直接返回str1
		}
		if (!str1.equals(str2)) {
			return str1 + "&nbsp;<font color='red'>[" + str2 + "]</font>";
		}
		return str1;
	}

	/**
	 * 返回跟异常
	 * 
	 * @param exception
	 * @return
	 */
	public static Throwable getRootCause(Throwable exception) {
		if (exception.getCause() != null) {
			return getRootCause(exception.getCause());
		} else {
			return exception;
		}
	}

	/**
	 * 清除0 id的显示
	 * 
	 * @param id
	 * @return
	 */
	public static String killZero(long id) {
		if (id == 0) {
			return "";
		} else {
			return String.valueOf(id);
		}
	}

	/**
	 * SBC case -> DBC case全角转换为半角
	 * 
	 * @param SBCstr
	 * @return
	 */
	public static final String SBC_to_DBC(String SBCstr) {
		if (CommonUtil.isEmpty(SBCstr)) {
			return "";
		} else {
			SBCstr = SBCstr.trim();
		}
		StringBuffer outStr = new StringBuffer();
		String str = "";
		byte[] b = null;
		StringBuffer sb = new StringBuffer(SBCstr);
		for (int i = 0; i < SBCstr.length(); i++) {
			try {
				str = sb.substring(i, i + 1);
				b = str.getBytes("unicode");
			} catch (java.io.UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			if (b[3] == -1) {
				b[2] = (byte) (b[2] + 32);
				b[3] = 0;
				try {
					outStr.append(new String(b, "unicode"));
				} catch (java.io.UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			} else {
				outStr.append(str);
			}
		}
		return outStr.toString();
	}

	/**
	 * 判断两个对象的值是否相等
	 * 
	 * @param obj1
	 * @param obj2
	 * @return
	 */
	public static boolean Equals(Object obj1, Object obj2) {
		if (obj1 == null && obj2 == null) {
			return false;
		}

		if (obj1 == null || obj2 == null) {
			return false;
		}

		return !obj1.equals(obj2);
	}

	public static Long[] stringToLong(String[] args) {
		if (args == null) {
			return null;
		}
		Long longs[] = new Long[args.length];
		for (int i = 0, n = args.length; i < n; i++) {
			longs[i] = Long.valueOf(args[i]);
		}
		return longs;
	}

	public static String[] stringToStrArray(String input, String delimiter) {
		if (StringUtils.isEmpty(input)) {
			return null;
		}
		String[] cmd = input.split(delimiter);
		return cmd;
	}

	/**
	 * 清除掉所有特殊字符 包括空格
	 * 
	 * @param str
	 * @return String
	 * @throws PatternSyntaxException
	 */
	public static String StringFilter(String str) {
		if ("".equals(str) || null == str) {
			return null;
		}
		// 只允许逗号和数字
		String regEx = "[^0-9\\,]";
		// 只允许字母和数字
		// String regEx = "[^a-zA-Z0-9]";
		// 清除掉所有特殊字符
		// String regEx =
		// "[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(str);
		return m.replaceAll("");
	}

	// 这个方法可以将用逗号隔开的字符串转换成String列表
	public static List stringToStrList(String input, String delimiter) {
		if (StringUtils.isEmpty(input)) {
			return null;
		}
		return Arrays.asList(stringToStrArray(input, delimiter));
	}

	public static Date parseDate(String dateStr, String format) {
		try {
			if (dateStr == null || dateStr.equals("")) {
				return null;
			}
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
			return simpleDateFormat.parse(dateStr);
		} catch (Exception e) {
			return new Date();
		}
	}

	public static Date parseDate(String dateStr) {
		return parseDate(dateStr, "yyyy-MM-dd HH:mm:ss");
	}

	public static Date parseDateTominute(String dateStr) {
		return parseDate(dateStr, "yyyy-MM-dd HH:mm");
	}

	public static String formatDate(Date date, String format) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
		if (date != null && !"".equals(date))
			return simpleDateFormat.format(date);
		return null;
	}

	public static String formatDate(Date date) {
		return formatDate(date, "yyyy-MM-dd HH:mm:ss");
	}

	public static String formatDateDay(Date date) {
		return formatDate(date, "yyyy-MM-dd");
	}

	public static String formatToday(int addDay) {
		return formatDate(getCalendarByModDay(addDay).getTime(),
				"yyyy-MM-dd HH:mm:ss");
	}

	public static String formatTodayNotTime(int addDay) {
		return formatDate(getCalendarByModDay(addDay).getTime(), "yyyy-MM-dd")
				+ " 00:00:00";
	}

	public static String formatTodayClearTime(int addDay) {
		return formatDate(getCalendarByModDay(addDay).getTime(), "yyyy-MM-dd");
	}

	public static String formatTodayModHour(int addHour) {
		return formatDate(getCalendarByModHour(addHour).getTime(),
				"yyyy-MM-dd HH:mm:ss");
	}

	public static Calendar getCalendarNotTime(int addDay) {
		Calendar calendarToday = Calendar.getInstance();
		calendarToday.clear(Calendar.HOUR);
		calendarToday.clear(Calendar.MINUTE);
		calendarToday.clear(Calendar.SECOND);
		calendarToday.add(Calendar.DAY_OF_MONTH, addDay);
		return calendarToday;
	}

	public static Calendar getCalendarByModDay(int addDay) {
		Calendar calendarToday = Calendar.getInstance();
		calendarToday.add(Calendar.DAY_OF_MONTH, addDay);
		return calendarToday;
	}

	public static Calendar getCalendarByModHour(int addHour) {
		Calendar calendarToday = Calendar.getInstance();
		calendarToday.add(Calendar.HOUR_OF_DAY, addHour);
		return calendarToday;
	}
	
	/**
	 * @author zhuyq
	 * @param addDay
	 * @param addMonth
	 * @return
	 */
	public static Calendar getCalendarByModMonthAndDay(int addDay, int addMonth) {
		Calendar calendarToday = Calendar.getInstance();
		calendarToday.add(Calendar.DATE, addDay);
		calendarToday.add(Calendar.MONTH, addMonth);
		return calendarToday;
	}
	
	/**
	 * @author zhuyq
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 */
	public static String getCalendarByTimeStr(String dateStr) throws ParseException {
		Calendar date = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		date.setTime(sdf.parse(dateStr));
		date.set(Calendar.DATE, date.get(Calendar.DATE) + 1);
		return sdf.format(date.getTime());
	}
	
	public static String formatCollectionToIds(List<String> lists) {
		StringBuilder sb = new StringBuilder(100);
		for (int i = 0; i < lists.size(); i++) {
			String id = lists.get(i);
			sb.append(id).append(",");
		}
		String ret = sb.toString();
		if (ret.length() > 0) {
			return sb.substring(0, sb.length() - 1).toString();
		}
		return "";
	}

	public static Integer getUnreadAnnoCount() {
		return 1;
	}

	/**
	 * @author wuxiaoxu 20120929
	 * @see 用于判断字符串是否纯数字
	 * @param digital
	 * @return
	 */
	public static boolean isDigital(String digital) {
		if (isEmpty(digital))
			return false;
		return digital.matches("[0-9]+");
	}


	public static String formatRoleName(String roleName) {
		return roleName + "\t";
	}

	/**
	 * 将异常信息转化成字符串
	 * @author zhuyq
	 * @param t
	 * @return
	 * @throws IOException
	 */
	public static String exception2String(Throwable t) throws IOException {
		if (t == null)
			return null;
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			t.printStackTrace(new PrintStream(baos));
		} finally {
			baos.close();
		}
		return baos.toString();
	}
	
	/**
	 * @see 发送邮件
	 * @wuxiaoxu 20130801
	 * @param prop
	 * @param address
	 * @param subject
	 * @param msg
	 * @return
	 */
	public static boolean sendEmail(Properties prop,String address,String subject,String msg) {
		SimpleEmail email = new SimpleEmail();//通过qq Server 发送邮件
		email.setHostName(prop.getProperty("hostName")); 	//设定smtp服务器
		email.setSSL(true);					//开启ssL
		email.setSslSmtpPort(prop.getProperty("port"));         //设定SSL端口
		email.setAuthentication(prop.getProperty("account"), prop.getProperty("password"));
		try {
			email.addTo(address, "reciever");//设定收件人
			email.setCharset("UTF-8");//设定内容的语言集
			email.setFrom(prop.getProperty("from"));//注意发件人必须要设置正确要不然发送无法成功
			email.setSubject(subject);//设定主题
			email.setMsg(msg);//设定邮件内容
			String a = email.send();//发送邮件
			System.out.println("邮件发送成功！" + a);
			return true;
		} catch (EmailException e) {
			e.printStackTrace();
			System.out.println("邮件发送失败！");
			return false;
		}
	}
	
	/**
	 * @see 发送html的邮件
	 * @author wuxiaoxu 20130802
	 * @param prop
	 * @param address
	 * @param subject
	 * @param msg
	 * @return
	 */
	public static boolean sendHtmlEmail(Properties prop, String address,
			String subject, String msg) {
		HtmlEmail email = new HtmlEmail();//html 邮件
		email.setHostName(prop.getProperty("hostName")); // 设定smtp服务器
		email.setSSL(true); // 设定是否使用SSL
		email.setSslSmtpPort(prop.getProperty("port")); // 设定SSL端口
		email.setAuthentication(prop.getProperty("account"), prop.getProperty("password"));
		try {
			email.addTo(address, "reciever"); // 设定收件人盛冲(490424996);
			email.setFrom(prop.getProperty("from"));
			email.setCharset("UTF-8");
			email.setSubject(subject);//设定主题

			// embed the image and get the content id
//			URL url = new URL("http://www.apache.org/images/asf_logo_wide.gif");//在网页内插入网络图片
//			String cid = email.embed(url, "wuxiaoxu");//cid 每次还不一样
//			email.setHtmlMsg("<html>这啥！！！！！ - <img src=\"cid:" + cid+ "\"></html>");
			email.setHtmlMsg(msg);
			email.setTextMsg("你的邮件客户端不支持Html格式"); // set the alternative message
			email.send();
			System.out.println("发送成功!");
			return true;
		} catch (EmailException e) {
			System.out.println("邮件发送出现异常！！！");
			return false;
		}
	}
	
	/**
	 * @see 发送带有附件的邮件
	 * @author wuxiaoxu 20130802
	 * @param prop
	 * @param address
	 * @param subject
	 * @param msg
	 * @param path
	 * @return
	 */
	public static boolean sendAttachmentEmail(Properties prop, String address,
			String subject, String msg, String path) {
		MultiPartEmail email = new MultiPartEmail();
		email.setHostName(prop.getProperty("hostName"));
		email.setSSL(true);
		email.setSslSmtpPort(prop.getProperty("port"));
		email.setAuthentication(prop.getProperty("account"), prop.getProperty("password")); // 设定smtp服务器的认证资料信息

		EmailAttachment attachment = new EmailAttachment();//附件
//		attachment.setPath("C:/Users/home/Desktop/QQ.png");//文件的绝对路径
		attachment.setPath(path);//文件的绝对路径
		//attachment.setURL(new URL(http://www.apache.org/images/asf_logo_wide.gif));//设定合法的URL指向文件
		attachment.setDisposition(EmailAttachment.ATTACHMENT);//设定附件的方式（内嵌，附件）
		attachment.setDescription("Picture");
		attachment.setName("logo.png"); //附件的文件名  附件的名字可以省略会从路径中截取
		//        attachment.setName("logo.xls");  //附件的文件名
		try {
			//----------设置发送信息-------------------------
			email.addTo(address, "reciever"); // 设定收件人
			email.setCharset("UTF-8"); // 设定内容的语言集
			email.setFrom(prop.getProperty("from")); // 设定发件人

			//----------设置发送内容-------------------------
			email.setSubject(subject); // 设定主题
			email.setMsg(msg); // 设定邮件内容
			email.attach(attachment);//连续添加多个附件
			//email.attach(attachment);
			//----------发送邮件  返回信息暂未处理是 String类型-------------------------
			email.send();
			System.out.println("邮件发送成功！！！！");
			return true;
		} catch (EmailException e) {
			e.printStackTrace();
			System.out.println("邮件发送失败......");
			return false;
		}

	}
}
