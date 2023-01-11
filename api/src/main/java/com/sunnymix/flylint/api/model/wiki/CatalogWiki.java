package com.sunnymix.flylint.api.model.wiki;

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
public class CatalogWiki {

    private String type;
    private String name;
    private String path;
    private Integer pathIndex;
    private String title;

    public Boolean root() {
        return path.equals("/");
    }

    public Boolean leaf() {
        return path.length() > 1;
    }

    public String pathName() {
        return path + name;
    }

    public String childrenPath() {
        return pathName() + "/";
    }

    public Boolean childOf(String parentPath) {
        return path.equals(parentPath);
    }

}
