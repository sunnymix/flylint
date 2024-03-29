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
public class Col implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String sheet;
    private final Integer col;
    private final Integer width;
    private final OffsetDateTime created;
    private final OffsetDateTime updated;

    public Col(Col value) {
        this.id = value.id;
        this.sheet = value.sheet;
        this.col = value.col;
        this.width = value.width;
        this.created = value.created;
        this.updated = value.updated;
    }

    public Col(
        Long id,
        String sheet,
        Integer col,
        Integer width,
        OffsetDateTime created,
        OffsetDateTime updated
    ) {
        this.id = id;
        this.sheet = sheet;
        this.col = col;
        this.width = width;
        this.created = created;
        this.updated = updated;
    }

    /**
     * Getter for <code>flylint.col.id</code>. ID
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Getter for <code>flylint.col.sheet</code>. 表格
     */
    public String getSheet() {
        return this.sheet;
    }

    /**
     * Getter for <code>flylint.col.col</code>. 列
     */
    public Integer getCol() {
        return this.col;
    }

    /**
     * Getter for <code>flylint.col.width</code>. 宽度
     */
    public Integer getWidth() {
        return this.width;
    }

    /**
     * Getter for <code>flylint.col.created</code>. 创建时间
     */
    public OffsetDateTime getCreated() {
        return this.created;
    }

    /**
     * Getter for <code>flylint.col.updated</code>. 更新时间
     */
    public OffsetDateTime getUpdated() {
        return this.updated;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Col (");

        sb.append(id);
        sb.append(", ").append(sheet);
        sb.append(", ").append(col);
        sb.append(", ").append(width);
        sb.append(", ").append(created);
        sb.append(", ").append(updated);

        sb.append(")");
        return sb.toString();
    }
}
