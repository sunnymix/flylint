/*
 * This file is generated by jOOQ.
 */
package com.sunnymix.flylint.dao.jooq.tables;


import com.sunnymix.flylint.api.common.jooq.converter.LocalDateTimeToOffsetDateTimeConverter;
import com.sunnymix.flylint.dao.jooq.Flylint;
import com.sunnymix.flylint.dao.jooq.Indexes;
import com.sunnymix.flylint.dao.jooq.Keys;
import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Function9;
import org.jooq.Identity;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Records;
import org.jooq.Row9;
import org.jooq.Schema;
import org.jooq.SelectField;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Wiki extends TableImpl<WikiRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>flylint.wiki</code>
     */
    public static final Wiki WIKI = new Wiki();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<WikiRecord> getRecordType() {
        return WikiRecord.class;
    }

    /**
     * The column <code>flylint.wiki.id</code>. ID
     */
    public final TableField<WikiRecord, Long> ID = createField(DSL.name("id"), SQLDataType.BIGINT.nullable(false).identity(true), this, "ID");

    /**
     * The column <code>flylint.wiki.type</code>. 类型
     */
    public final TableField<WikiRecord, String> TYPE = createField(DSL.name("type"), SQLDataType.VARCHAR(50).nullable(false).defaultValue(DSL.inline("wiki", SQLDataType.VARCHAR)), this, "类型");

    /**
     * The column <code>flylint.wiki.name</code>. Name
     */
    public final TableField<WikiRecord, String> NAME = createField(DSL.name("name"), SQLDataType.VARCHAR(100).nullable(false).defaultValue(DSL.inline("", SQLDataType.VARCHAR)), this, "Name");

    /**
     * The column <code>flylint.wiki.path</code>. 路径
     */
    public final TableField<WikiRecord, String> PATH = createField(DSL.name("path"), SQLDataType.VARCHAR(1000).nullable(false).defaultValue(DSL.inline("", SQLDataType.VARCHAR)), this, "路径");

    /**
     * The column <code>flylint.wiki.path_index</code>. 路径索引
     */
    public final TableField<WikiRecord, Integer> PATH_INDEX = createField(DSL.name("path_index"), SQLDataType.INTEGER.nullable(false).defaultValue(DSL.inline("0", SQLDataType.INTEGER)), this, "路径索引");

    /**
     * The column <code>flylint.wiki.title</code>. 标题
     */
    public final TableField<WikiRecord, String> TITLE = createField(DSL.name("title"), SQLDataType.VARCHAR(100).nullable(false).defaultValue(DSL.inline("", SQLDataType.VARCHAR)), this, "标题");

    /**
     * The column <code>flylint.wiki.content</code>. 内容
     */
    public final TableField<WikiRecord, String> CONTENT = createField(DSL.name("content"), SQLDataType.CLOB.nullable(false), this, "内容");

    /**
     * The column <code>flylint.wiki.created</code>. 创建时间
     */
    public final TableField<WikiRecord, OffsetDateTime> CREATED = createField(DSL.name("created"), SQLDataType.LOCALDATETIME(0).nullable(false).defaultValue(DSL.field("CURRENT_TIMESTAMP", SQLDataType.LOCALDATETIME)), this, "创建时间", new LocalDateTimeToOffsetDateTimeConverter());

    /**
     * The column <code>flylint.wiki.updated</code>. 更新时间
     */
    public final TableField<WikiRecord, OffsetDateTime> UPDATED = createField(DSL.name("updated"), SQLDataType.LOCALDATETIME(0).nullable(false).defaultValue(DSL.field("CURRENT_TIMESTAMP", SQLDataType.LOCALDATETIME)), this, "更新时间", new LocalDateTimeToOffsetDateTimeConverter());

    private Wiki(Name alias, Table<WikiRecord> aliased) {
        this(alias, aliased, null);
    }

    private Wiki(Name alias, Table<WikiRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>flylint.wiki</code> table reference
     */
    public Wiki(String alias) {
        this(DSL.name(alias), WIKI);
    }

    /**
     * Create an aliased <code>flylint.wiki</code> table reference
     */
    public Wiki(Name alias) {
        this(alias, WIKI);
    }

    /**
     * Create a <code>flylint.wiki</code> table reference
     */
    public Wiki() {
        this(DSL.name("wiki"), null);
    }

    public <O extends Record> Wiki(Table<O> child, ForeignKey<O, WikiRecord> key) {
        super(child, key, WIKI);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Flylint.FLYLINT;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.WIKI_IDX_PATH, Indexes.WIKI_IDX_TITLE);
    }

    @Override
    public Identity<WikiRecord, Long> getIdentity() {
        return (Identity<WikiRecord, Long>) super.getIdentity();
    }

    @Override
    public UniqueKey<WikiRecord> getPrimaryKey() {
        return Keys.KEY_WIKI_PRIMARY;
    }

    @Override
    public List<UniqueKey<WikiRecord>> getUniqueKeys() {
        return Arrays.asList(Keys.KEY_WIKI_UK_NAME);
    }

    @Override
    public Wiki as(String alias) {
        return new Wiki(DSL.name(alias), this);
    }

    @Override
    public Wiki as(Name alias) {
        return new Wiki(alias, this);
    }

    @Override
    public Wiki as(Table<?> alias) {
        return new Wiki(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public Wiki rename(String name) {
        return new Wiki(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Wiki rename(Name name) {
        return new Wiki(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public Wiki rename(Table<?> name) {
        return new Wiki(name.getQualifiedName(), null);
    }

    // -------------------------------------------------------------------------
    // Row9 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row9<Long, String, String, String, Integer, String, String, OffsetDateTime, OffsetDateTime> fieldsRow() {
        return (Row9) super.fieldsRow();
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Function)}.
     */
    public <U> SelectField<U> mapping(Function9<? super Long, ? super String, ? super String, ? super String, ? super Integer, ? super String, ? super String, ? super OffsetDateTime, ? super OffsetDateTime, ? extends U> from) {
        return convertFrom(Records.mapping(from));
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Class,
     * Function)}.
     */
    public <U> SelectField<U> mapping(Class<U> toType, Function9<? super Long, ? super String, ? super String, ? super String, ? super Integer, ? super String, ? super String, ? super OffsetDateTime, ? super OffsetDateTime, ? extends U> from) {
        return convertFrom(toType, Records.mapping(from));
    }
}
