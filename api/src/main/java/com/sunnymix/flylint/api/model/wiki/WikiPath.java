package com.sunnymix.flylint.api.model.wiki;

import com.sunnymix.flylint.api.common.Id;

/**
 * @author sunnymix
 */
public class WikiPath {

    public static final Integer MAX_LENGTH = 32;

    private final String path;

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
            return Id.newId();
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
