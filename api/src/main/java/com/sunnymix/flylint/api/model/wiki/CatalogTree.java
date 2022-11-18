package com.sunnymix.flylint.api.model.wiki;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogTree {

    private String key;
    private String name;
    private String path;
    private Integer pathIndex;
    private String title;
    @Builder.Default
    private List<CatalogTree> children = new ArrayList<>();

    public static List<CatalogTree> makeTreeList(List<CatalogWiki> catalogList) {
        if (catalogList == null || catalogList.isEmpty()) {
            return List.of();
        }

        var rootCatalogList = catalogList.stream().filter(CatalogWiki::root).toList();

        if (rootCatalogList.isEmpty()) {
            return List.of();
        }

        var treeList = rootCatalogList.stream()
            .map(root -> makeTree(root, catalogList))
            .sorted(Comparator.comparing(CatalogTree::getPathIndex))
            .toList();

        return treeList;
    }

    public static CatalogTree makeTree(CatalogWiki catalog, List<CatalogWiki> catalogs) {
        var children = catalogs.stream()
            .filter(c -> c.childOf(catalog.childrenPath()))
            .map(child -> makeTree(child, catalogs))
            .sorted(Comparator.comparing(CatalogTree::getPathIndex))
            .toList();

        return CatalogTree.builder()
            .key(catalog.getName())
            .name(catalog.getName())
            .path(catalog.getPath())
            .pathIndex(catalog.getPathIndex())
            .title(catalog.getTitle())
            .children(children)
            .build();
    }

}
