package com.sunnymix.flylint.api.model.wiki;

import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;

/**
 * @author sunnymix
 */
public class DescendantPath {

    private final String value;

    public static DescendantPath of(String path, String name) {
        return new DescendantPath(path, name);
    }

    public DescendantPath(String path, String name) {
        value = path + name + "/";
    }

    public String value() {
        return value;
    }

}
