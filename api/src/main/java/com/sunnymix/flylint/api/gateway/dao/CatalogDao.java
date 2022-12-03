package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.catalog.Catalog;
import com.sunnymix.flylint.api.model.wiki.CatalogTree;
import com.sunnymix.flylint.api.model.wiki.CatalogWiki;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static com.sunnymix.flylint.dao.jooq.Tables.WIKI;
import static org.jooq.impl.DSL.charLength;
import static org.jooq.impl.DSL.replace;

/**
 * TODO:
 * - hidden
 *
 * @author sunnymix
 */
@Repository
public class CatalogDao {

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    public List<CatalogTree> query() {
        var catalogList = dsl.select(WIKI.NAME, WIKI.PATH, WIKI.PATH_INDEX, WIKI.TITLE)
            .from(WIKI)
            .where(WIKI.PATH.ne(""))
            .fetchStreamInto(CatalogWiki.class)
            .toList();

        var treeList = CatalogTree.makeTreeList(catalogList);
        return treeList;
    }

    public Optional<Catalog> one(String name) {
        if (name == null || name.isBlank()) {
            return Optional.empty();
        }

        if (name.equals("/")) {
            return Optional.empty();
        }

        return dsl.select(WIKI.NAME, WIKI.PATH, WIKI.PATH_INDEX)
            .from(WIKI)
            .where(WIKI.NAME.eq(name))
            .limit(1)
            .fetchOptionalInto(Catalog.class);
    }

    public void moveToNewPath(String name, String newPath, Integer newPathIndex) {
        dsl
            .update(WIKI)
            .set(WIKI.PATH, newPath)
            .set(WIKI.PATH_INDEX, newPathIndex)
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.NAME.eq(name))
            .execute();
    }

    public void moveDescendantToNewPath(String descendantPath, String newPath) {
        dsl
            .update(WIKI)
            .set(WIKI.PATH, replace(WIKI.PATH, descendantPath, newPath))
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.startsWith(descendantPath))
            .execute();
    }

    public void decreaseSiblingPathIndex(String path, Integer siblingPathIndexStart) {
        dsl
            .update(WIKI)
            .set(WIKI.PATH_INDEX, WIKI.PATH_INDEX.minus(1))
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.eq(path).and(WIKI.PATH_INDEX.ge(siblingPathIndexStart)))
            .execute();
    }

    public void increaseSiblingPathIndex(String path, Integer siblingPathIndexStart) {
        dsl
            .update(WIKI)
            .set(WIKI.PATH_INDEX, WIKI.PATH_INDEX.plus(1))
            .set(WIKI.UPDATED, OffsetDateTime.now())
            .where(WIKI.PATH.eq(path).and(WIKI.PATH_INDEX.ge(siblingPathIndexStart)))
            .execute();
    }

    public List<String> nodes() {
        var nameList = dsl
            .select(WIKI.PATH)
            .from(WIKI)
            .where(WIKI.PATH.startsWith("/").and(charLength(WIKI.PATH).gt(2)))
            .fetchStreamInto(String.class)
            .distinct()
            .flatMap(p -> Stream.of(p.split("/")))
            .distinct()
            .toList();
        return nameList;
    }

}
