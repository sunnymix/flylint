package com.sunnymix.flylint.api.common.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Page {

    private Integer page;

    private Integer size;

    private Boolean next;

    public static Page empty() {
        return Page.builder()
            .page(0)
            .size(0)
            .next(false)
            .build();
    }

    public static Page all() {
        return Page.builder()
            .page(0)
            .size(Integer.MAX_VALUE)
            .next(false)
            .build();
    }

    public static Page list(Integer size) {
        return Page.builder()
            .page(0)
            .size(size)
            .next(false)
            .build();
    }

    public static Page one() {
        return Page.builder()
            .page(0)
            .size(1)
            .next(false)
            .build();
    }

}
