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
public class MoveCatalog {

    public static final String CHILD_PLACE = "child";
    public static final String NEXT_PLACE = "next";
    public static final String PREVIOUS_PLACE = "previous";

    private String name;
    private String toName;
    private String place;

}
