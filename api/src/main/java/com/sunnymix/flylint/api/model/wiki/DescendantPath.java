package com.sunnymix.flylint.api.model.wiki;

/**
 * @author sunnymix
 */
public class DescendantPath {

    private final String value;

    public static DescendantPath of(String path, String name) {
        return new DescendantPath(path, name);
    }

    public DescendantPath(String path, String name) {
        value = (path.trim() + name.trim() + "/").toLowerCase();
    }

    public String value() {
        return value;
    }

}
