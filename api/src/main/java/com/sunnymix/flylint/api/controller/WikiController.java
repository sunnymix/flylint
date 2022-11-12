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
        sb.append("apis: ").append("query").append(". ");
        return sb.toString();
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

    @PostMapping("/{path}")
    public Out<Void> update(@PathVariable String path, @RequestBody UpdateWiki updateWiki) {
        var success = wikiDao.update(path, updateWiki);
        return Out.of(success);
    }

}
