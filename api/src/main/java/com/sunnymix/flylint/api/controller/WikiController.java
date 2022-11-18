package com.sunnymix.flylint.api.controller;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.WikiDao;
import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import com.sunnymix.flylint.api.model.wiki.DetailWiki;
import com.sunnymix.flylint.api.model.wiki.UpdateWiki;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/wiki")
public class WikiController {

    @Autowired
    private WikiDao wikiDao;

    @GetMapping(path = {"", "/"}, produces = MediaType.TEXT_PLAIN_VALUE)
    public String index() {
        StringBuilder sb = new StringBuilder();
        sb.append("controller: wiki. ");
        sb.append("apis: ").append("create, query, detail, update").append(". ");
        return sb.toString();
    }

    @PostMapping("/create")
    public Out<String> create() {
        var path = wikiDao.create();
        return Out.ok(path);
    }

    @PostMapping("/{name}/update/name/{newName}")
    public Out<String> updateName(@PathVariable String name, @PathVariable String newName) {
        var updatedName = wikiDao.updateName(name, newName);
        return Out.of(updatedName);
    }

    @PostMapping("/{name}/update/title")
    public Out<String> updateTitle(@PathVariable String name, @RequestBody UpdateWiki updateWiki) {
        var updatedTitle = wikiDao.updateTitle(name, updateWiki.getTitle().orElse(""));
        return Out.of(updatedTitle);
    }

    @PostMapping("/{path}/update/content")
    public Out<Void> updateContent(@PathVariable String path, @RequestBody UpdateWiki updateWiki) {
        var success = wikiDao.updateContent(path, updateWiki.getContent().orElse(""));
        return Out.of(success);
    }

    @PostMapping("/{path}/remove")
    public Out<Void> remove(@PathVariable String path) {
        var success = wikiDao.remove(path);
        return Out.of(success);
    }

    @GetMapping("/query")
    public Out<List<BasicWiki>> query(@RequestParam(required = false) Optional<String> keyword) {
        var wikis = wikiDao.query(keyword);
        return Out.ok(wikis);
    }

    @GetMapping("/{path}")
    public Out<DetailWiki> detail(@PathVariable String path) {
        var wiki = wikiDao.detail(path);
        return Out.ok(wiki);
    }

}
