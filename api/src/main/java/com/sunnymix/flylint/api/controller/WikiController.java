package com.sunnymix.flylint.api.controller;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.WikiDao;
import com.sunnymix.flylint.api.model.wiki.BasicWiki;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("wiki")
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

    @GetMapping("query")
    public Out<List<BasicWiki>> query(@RequestParam(required = false) Optional<String> keyword) {
        var wikis = wikiDao.basicQuery(keyword);
        return Out.ok(wikis);
    }

}
