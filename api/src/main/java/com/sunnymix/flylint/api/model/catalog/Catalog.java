package com.sunnymix.flylint.api.model.catalog;

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
public class Catalog {

    private String name;
    private String path;
    private Integer pathIndex;

}
