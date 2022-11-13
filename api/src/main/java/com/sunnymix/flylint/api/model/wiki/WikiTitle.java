package com.sunnymix.flylint.api.model.wiki;

public class WikiTitle {

    public static final String DEFAULT_TITLE = "未命名文档";

    private String title;

    public String title() {
        return this.title;
    }

    public WikiTitle() {
        this.title = DEFAULT_TITLE;
    }

    public WikiTitle(String title) {
        this.title = fixTitle(title);
    }

    private String fixTitle(String title) {
        if (title == null || title.isBlank()) {
            return DEFAULT_TITLE;
        }
        return title;
    }

}
