package com.sunnymix.flylint.api.common;

/**
 * @author sunnymix
 */
public class Strings {

    public static boolean isNotEmpty(String s) {
        return !Strings.isEmpty(s);
    }

    public static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }

}
