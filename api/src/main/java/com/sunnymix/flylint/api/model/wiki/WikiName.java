package com.sunnymix.flylint.api.model.wiki;

import com.sunnymix.flylint.api.common.Id;

/**
 * @author sunnymix
 */
public class WikiName {

    public static final Integer MAX_LENGTH = 32;

    private final String name;

    public String name() {
        return name;
    }

    public WikiName() {
        name = fixName(null);
    }

    public WikiName(String name) {
        this.name = fixName(name);
    }

    private String fixName(String name) {
        if (name == null || name.isBlank()) {
            return Id.newId();
        }
        return fixLength(name);
    }

    private String fixLength(String name) {
        if (name.length() > MAX_LENGTH) {
            return name.substring(0, MAX_LENGTH);
        }
        return name;
    }

}
