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

    protected Long id;
    protected String path;
    protected String title;
    protected OffsetDateTime created;
    protected OffsetDateTime updated;

}
