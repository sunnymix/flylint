/*
 * This file is generated by jOOQ.
 */
package com.sunnymix.flylint.dao.jooq.tables.pojos;


import java.io.Serializable;
import java.time.OffsetDateTime;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Wiki implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String type;
    private final String name;
    private final String path;
    private final Integer pathIndex;
    private final String title;
    private final String content;
    private final OffsetDateTime created;
    private final OffsetDateTime updated;

    public Wiki(Wiki value) {
        this.id = value.id;
        this.type = value.type;
        this.name = value.name;
        this.path = value.path;
        this.pathIndex = value.pathIndex;
        this.title = value.title;
        this.content = value.content;
        this.created = value.created;
        this.updated = value.updated;
    }

    public Wiki(
        Long id,
        String type,
        String name,
        String path,
        Integer pathIndex,
        String title,
        String content,
        OffsetDateTime created,
        OffsetDateTime updated
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.path = path;
        this.pathIndex = pathIndex;
        this.title = title;
        this.content = content;
        this.created = created;
        this.updated = updated;
    }

    /**
     * Getter for <code>flylint.wiki.id</code>. ID
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Getter for <code>flylint.wiki.type</code>. 类型
     */
    public String getType() {
        return this.type;
    }

    /**
     * Getter for <code>flylint.wiki.name</code>. Name
     */
    public String getName() {
        return this.name;
    }

    /**
     * Getter for <code>flylint.wiki.path</code>. 路径
     */
    public String getPath() {
        return this.path;
    }

    /**
     * Getter for <code>flylint.wiki.path_index</code>. 路径索引
     */
    public Integer getPathIndex() {
        return this.pathIndex;
    }

    /**
     * Getter for <code>flylint.wiki.title</code>. 标题
     */
    public String getTitle() {
        return this.title;
    }

    /**
     * Getter for <code>flylint.wiki.content</code>. 内容
     */
    public String getContent() {
        return this.content;
    }

    /**
     * Getter for <code>flylint.wiki.created</code>. 创建时间
     */
    public OffsetDateTime getCreated() {
        return this.created;
    }

    /**
     * Getter for <code>flylint.wiki.updated</code>. 更新时间
     */
    public OffsetDateTime getUpdated() {
        return this.updated;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Wiki (");

        sb.append(id);
        sb.append(", ").append(type);
        sb.append(", ").append(name);
        sb.append(", ").append(path);
        sb.append(", ").append(pathIndex);
        sb.append(", ").append(title);
        sb.append(", ").append(content);
        sb.append(", ").append(created);
        sb.append(", ").append(updated);

        sb.append(")");
        return sb.toString();
    }
}
