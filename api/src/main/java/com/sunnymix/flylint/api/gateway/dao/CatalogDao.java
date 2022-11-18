package com.sunnymix.flylint.api.gateway.dao;

import com.sunnymix.flylint.api.model.wiki.CatalogTree;
import com.sunnymix.flylint.api.model.wiki.CatalogWiki;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import static com.sunnymix.flylint.dao.jooq.Tables.WIKI;

/**
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

}
