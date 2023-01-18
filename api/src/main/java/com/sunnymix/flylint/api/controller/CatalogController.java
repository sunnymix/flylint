package com.sunnymix.flylint.api.controller;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.wiki.CatalogDao;
import com.sunnymix.flylint.api.model.catalog.MoveCatalog;
import com.sunnymix.flylint.api.model.wiki.CatalogTree;
import com.sunnymix.flylint.api.service.CatalogMovingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/catalog")
public class CatalogController {

    @Autowired
    private CatalogDao catalogDao;

    @Autowired
    private CatalogMovingService catalogMovingService;

    @GetMapping("/query")
    public Out<List<CatalogTree>> query() {
        var treeList = catalogDao.query();
        return Out.ok(treeList);
    }

    @PostMapping("/move")
    public Out<Void> move(@RequestBody MoveCatalog move) {
        catalogMovingService.move(move.getName(), move.getToName(), move.getPlace());
        return Out.ok();
    }

    @GetMapping("/nodes")
    public Out<List<String>> nodes() {
        var nameList = catalogDao.nodes();
        return Out.ok(nameList);
    }

}
