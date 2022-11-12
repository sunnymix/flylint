package com.sunnymix.flylint.api.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

/**
 * @author sunnymix
 */
@RestController
public class AppController {

    @GetMapping(path = {"", "/"}, produces = MediaType.TEXT_PLAIN_VALUE)
    public String name() {
        StringBuilder sb = new StringBuilder();
        sb.append("flylint-api. ");
        sb.append("controllers: ").append("wiki").append(". ");
        sb.append("server time: ").append(OffsetDateTime.now()).append(". ");
        return sb.toString();
    }

}
