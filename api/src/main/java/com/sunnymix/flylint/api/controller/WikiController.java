package com.sunnymix.flylint.api.controller;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.wiki.WikiDao;
import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import com.sunnymix.flylint.api.model.wiki.CreateWiki;
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
    public Out<String> create(@RequestBody CreateWiki createWiki) {
        var path = wikiDao.create(createWiki.getCatalogName(), createWiki.getType());
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

    @PostMapping("/{name}/update/content")
    public Out<Void> updateContent(@PathVariable String name, @RequestBody UpdateWiki updateWiki) {
        var success = wikiDao.updateContent(name, updateWiki.getContent().orElse(""));
        return Out.of(success);
    }

    @PostMapping("/{name}/remove")
    public Out<Void> remove(@PathVariable String name) {
        var success = wikiDao.remove(name);
        return Out.of(success);
    }

    @GetMapping("/query")
    public Out<List<BasicWiki>> query(@RequestParam(required = false) Optional<String> keyword) {
        var wikis = wikiDao.query(keyword);
        return Out.ok(wikis);
    }

    @GetMapping("/{name}")
    public Out<DetailWiki> detail(@PathVariable String name) {
        var wiki = wikiDao.detail(name);
        return Out.ok(wiki);
    }

    @GetMapping("/{name}/basic")
    public Out<DetailWiki> basic(@PathVariable String name) {
        var wiki = wikiDao.detail(name);
        return Out.ok(wiki);
    }

}
