package com.sunnymix.flylint.api.model.wiki;

import com.sunnymix.flylint.api.common.Id;

/**
 * @author sunnymix
 */
public class WikiPath {

    public static final String PREFIX = "wiki";

    public static final Integer MAX_LENGTH = 32;

    private String path;

    public String path() {
        return path;
    }

    public WikiPath() {
        path = fixValue(null);
    }

    public WikiPath(String value) {
        path = fixValue(value);
    }

    private String fixValue(String value) {
        if (value == null || value.isBlank()) {
            return PREFIX + Id.newId();
        }
        if (value.indexOf(PREFIX) != 0) {
            return fixLength(PREFIX + value);
        }
        return fixLength(value);
    }

    private String fixLength(String path) {
        if (path.length() > MAX_LENGTH) {
            return path.substring(0, MAX_LENGTH);
        }
        return path;
    }

}
