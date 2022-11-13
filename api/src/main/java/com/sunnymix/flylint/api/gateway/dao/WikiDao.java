package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.common.Id;
import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import com.sunnymix.flylint.api.model.wiki.DetailWiki;
import com.sunnymix.flylint.api.model.wiki.UpdateWiki;
import com.sunnymix.flylint.dao.jooq.tables.records.WikiRecord;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.UpdateSetMoreStep;
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
        var path = "wiki-" + Id.newId();
        var record = new WikiRecord();
        record.setId(null);
        record.setPath(path);
        record.setTitle("未命名文档");
        record.setContent("");
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        dsl.executeInsert(record);
        return path;
    }

    public Boolean update(String path, UpdateWiki updateWiki) {
        var firstStep = dsl.update(WIKI);
        UpdateSetMoreStep<WikiRecord> setSteps = null;
        if (updateWiki.getContent().isPresent()) {
            setSteps = (setSteps != null ? setSteps : firstStep).set(WIKI.CONTENT, updateWiki.getContent().get());
        }
        if (setSteps == null) {
            return false;
        }

        setSteps = setSteps.set(WIKI.UPDATED, OffsetDateTime.now());
        int updateCount = setSteps.where(WIKI.PATH.eq(path)).execute();
        return updateCount > 0;
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

}
