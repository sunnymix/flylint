package com.sunnymix.flylint.api.controller;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.CatalogDao;
import com.sunnymix.flylint.api.model.wiki.CatalogTree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/catalog")
public class CatalogController {

    @Autowired
    private CatalogDao catalogDao;

    @GetMapping("/query")
    public Out<List<CatalogTree>> query() {
        var treeList = catalogDao.query();
        return Out.ok(treeList);
    }

}
