package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.wiki.*;
import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.impl.QOM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.sunnymix.flylint.dao.jooq.Tables.WIKI;
import static org.jooq.impl.DSL.*;

/**
 * @author sunnymix
 */
@Repository
public class WikiDao {

    public static final String EMPTY_PATH = "";

    public static final Integer EMPTY_PATH_INDEX = 0;

    public static final String ROOT_PATH = "/";

    public static final Integer ROOT_PATH_INDEX = 0;

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    @Transactional
    public String create(Optional<String> catalogNameOpt) {
        if (catalogNameOpt.isEmpty()) {
            return create();
        }

        var catalogName = catalogNameOpt.get().trim();

        if (catalogName.equals(ROOT_PATH)) {
            return create(ROOT_PATH, ROOT_PATH_INDEX);
        }

        var catalogOpt = one(catalogName);
        if (catalogOpt.isEmpty()) {
            return create();
        }

        var catalog = catalogOpt.get();
        var path = DescendantPath.of(catalog.getPath(), catalog.getName()).value();
        var pathIndex = maxPathIndexOfMyDescendant(path) + 1;
        return create(path, pathIndex);
    }

    private String create() {
        return create(EMPTY_PATH, EMPTY_PATH_INDEX);
    }

    private String create(String path, Integer pathIndex) {
        var randomName = new WikiName().name();
        var record = new WikiRecord();
        record.setId(null);
        record.setName(randomName);
        record.setPath(path);
        record.setPathIndex(pathIndex);
        record.setTitle(new WikiTitle().title());
        record.setContent("");
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        dsl.executeInsert(record);
        return randomName;
    }

    public Optional<String> updateTitle(String name, String title) {
        String fixTitle = new WikiTitle(title).title();
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.TITLE, fixTitle)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.NAME.eq(name))
            .execute();

        if (updateCount < 0) {
            return Optional.empty();
        }

        return Optional.of(fixTitle);
    }

    @Transactional
    public Optional<String> updateName(String name, String newName) {
        var wikiOpt = one(name);
        if (wikiOpt.isEmpty()) {
            return Optional.empty();
        }
        var wiki = wikiOpt.get();

        newName = new WikiName(newName).name();
        if (newName.equals(name)) {
            return Optional.empty();
        }
        if (exist(newName)) {
            return Optional.empty();
        }

        updateMyName(name, newName);

        var descendantPath = DescendantPath.of(wiki.getPath(), wiki.getName()).value();
        var newDescendantPath = DescendantPath.of(wiki.getPath(), newName).value();
        updateDescendantPath(descendantPath, newDescendantPath);

        return Optional.of(newName);
    }

    private void updateMyName(String name, String newName) {
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.NAME, newName)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.NAME.eq(name))
            .execute();
    }

    private void updateDescendantPath(String pathStart, String newPathStart) {
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.PATH, replace(WIKI.PATH, pathStart, newPathStart))
            .where(WIKI.PATH.startsWith(pathStart))
            .execute();
    }

    public Boolean updateContent(String name, String content) {
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.CONTENT, content)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.NAME.eq(name))
            .execute();
        return updateCount > 0;
    }

    @Transactional
    public Boolean remove(String name) {
        var wikiOpt = one(name);
        if (wikiOpt.isEmpty()) {
            return true;
        }

        // Remove Self:
        var wiki = wikiOpt.get();
        dsl.deleteFrom(WIKI).where(WIKI.NAME.eq(name)).execute();

        // Remove Descendant:
        var descendantPath = DescendantPath.of(wiki.getPath(), wiki.getName()).value();
        dsl.deleteFrom(WIKI).where(WIKI.PATH.startsWith(descendantPath)).execute();

        return true;
    }

    public List<BasicWiki> query(Optional<String> keyword) {
        // Condition
        var conditions = new ArrayList<Condition>();
        keyword.ifPresent(kw -> conditions.add(WIKI.TITLE.contains(kw)));
        var condition = conditions.stream().reduce(Condition::and).orElse(trueCondition());

        return dsl
            .select(WIKI.ID, WIKI.NAME, WIKI.PATH, WIKI.PATH_INDEX, WIKI.TITLE, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(condition)
            .orderBy(WIKI.UPDATED.desc())
            .limit(100)
            .fetchStreamInto(BasicWiki.class).toList();
    }

    public Optional<DetailWiki> detail(String name) {
        return dsl
            .select(WIKI.ID, WIKI.NAME, WIKI.PATH, WIKI.PATH_INDEX, WIKI.TITLE, WIKI.CONTENT, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(WIKI.NAME.eq(name))
            .limit(1)
            .fetchOptionalInto(DetailWiki.class);
    }

    public Boolean exist(String name) {
        return detail(name).isPresent();
    }

    private Optional<WikiRecord> one(String name) {
        if (name == null || name.isBlank()) {
            return Optional.empty();
        }

        return dsl
            .selectFrom(WIKI)
            .where(WIKI.NAME.eq(name))
            .limit(1)
            .fetchOptionalInto(WikiRecord.class);
    }

    private Integer maxPathIndexOfMyDescendant(String descendantPath) {
        if (descendantPath == null || descendantPath.isBlank()) {
            return 0;
        }

        if (descendantPath.equals(ROOT_PATH)) {
            return ROOT_PATH_INDEX;
        }

        var maxPathIndexOpt = dsl
            .select(max(WIKI.PATH_INDEX))
            .from(WIKI)
            .where(WIKI.PATH.eq(descendantPath))
            .fetchOptionalInto(Integer.class);

        return maxPathIndexOpt.orElse(-1);
    }

}
