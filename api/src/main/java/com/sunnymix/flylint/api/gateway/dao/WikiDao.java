package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import com.sunnymix.flylint.api.model.wiki.DetailWiki;
import com.sunnymix.flylint.api.model.wiki.WikiPath;
import com.sunnymix.flylint.api.model.wiki.WikiTitle;
import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.sunnymix.flylint.dao.jooq.Tables.WIKI;
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
        var path = new WikiPath().path();
        var record = new WikiRecord();
        record.setId(null);
        record.setPath(path);
        record.setTitle(new WikiTitle().title());
        record.setContent("");
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        dsl.executeInsert(record);
        return path;
    }

    public Optional<String> updateTitle(String path, String title) {
        String fixTitle = new WikiTitle(title).title();
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.TITLE, fixTitle)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.eq(path))
            .execute();

        if (updateCount < 0) {
            return Optional.empty();
        }

        return Optional.of(fixTitle);
    }

    public Optional<String> updatePath(String path, String newPath) {
        String fixPath = new WikiPath(newPath).path();

        if (fixPath.equals(path)) {
            return Optional.empty();
        }

        if (exist(fixPath)) {
            return Optional.empty();
        }

        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.PATH, fixPath)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.eq(path))
            .execute();

        if (updateCount < 0) {
            return Optional.empty();
        }

        return Optional.of(fixPath);
    }

    public Boolean updateContent(String path, String content) {
        var updateCount = dsl
            .update(WIKI)
            .set(WIKI.CONTENT, content)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.eq(path))
            .execute();
        return updateCount > 0;
    }

    public Boolean remove(String path) {
        int deleteCount = dsl.deleteFrom(WIKI).where(WIKI.PATH.eq(path)).execute();
        return deleteCount > 0;
    }

    public List<BasicWiki> query(Optional<String> keyword) {
        // Condition
        var conditions = new ArrayList<Condition>();
        keyword.ifPresent(kw -> conditions.add(WIKI.TITLE.contains(kw)));
        var condition = conditions.stream().reduce(Condition::and).orElse(trueCondition());

        return dsl
            .select(WIKI.ID, WIKI.PATH, WIKI.TITLE, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(condition)
            .orderBy(WIKI.UPDATED.desc())
            .limit(100)
            .fetchStreamInto(BasicWiki.class).toList();
    }

    public Optional<DetailWiki> detail(String path) {
        return dsl
            .select(WIKI.ID, WIKI.PATH, WIKI.TITLE, WIKI.CONTENT, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(WIKI.PATH.eq(path))
            .limit(1)
            .fetchOptionalInto(DetailWiki.class);
    }

    public Boolean exist(String path) {
        return detail(path).isPresent();
    }

}
