package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import com.sunnymix.flylint.api.model.wiki.DetailWiki;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

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

    public Optional<DetailWiki> get(String path) {
        return dsl
            .select(WIKI.ID, WIKI.PATH, WIKI.TITLE, WIKI.CONTENT, WIKI.CREATED, WIKI.UPDATED)
            .from(WIKI)
            .where(WIKI.PATH.eq(path))
            .limit(1)
            .fetchOptionalInto(DetailWiki.class);
    }

}
