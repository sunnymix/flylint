package com.sunnymix.flylint.api.model.wiki;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BasicWiki {

    private Long id;
    private String name;
    private String title;
    private OffsetDateTime created;
    private OffsetDateTime updated;

}
