package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.wiki.*;
import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.sunnymix.flylint.dao.jooq.Tables.WIKI;
import static org.jooq.impl.DSL.replace;
import static org.jooq.impl.DSL.trueCondition;

/**
 * @author sunnymix
 */
@Repository
public class WikiDao {

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    public String create() {
        var path = new WikiName().name();
        var record = new WikiRecord();
        record.setId(null);
        record.setName(path);
        record.setPath("");
        record.setTitle(new WikiTitle().title());
        record.setContent("");
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        dsl.executeInsert(record);
        return path;
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

    public Boolean remove(String name) {
        int deleteCount = dsl.deleteFrom(WIKI).where(WIKI.NAME.eq(name)).execute();
        return deleteCount > 0;
    }

    public List<BasicWiki> query(Optional<String> keyword) {
        // Condition
        var conditions = new ArrayList<Condition>();
        keyword.ifPresent(kw -> conditions.add(WIKI.TITLE.contains(kw)));
        var condition = conditions.stream().reduce(Condition::and).orElse(trueCondition());

        return dsl
            .select(WIKI.ID, WIKI.NAME, WIKI.TITLE, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(condition)
            .orderBy(WIKI.UPDATED.desc())
            .limit(100)
            .fetchStreamInto(BasicWiki.class).toList();
    }

    public Optional<DetailWiki> detail(String name) {
        return dsl
            .select(WIKI.ID, WIKI.NAME, WIKI.TITLE, WIKI.CONTENT, WIKI.CREATED, WIKI.UPDATED)
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

}
