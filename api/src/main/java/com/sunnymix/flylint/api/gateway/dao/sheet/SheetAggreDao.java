package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.gateway.dao.wiki.WikiDao;
import com.sunnymix.flylint.api.model.sheet.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Repository
public class SheetAggreDao {

    @Autowired
    private ColDao colDao;

    @Autowired
    private RowDao rowDao;

    @Autowired
    private CellDao cellDao;

    @Autowired
    private WikiDao wikiDao;

    public Optional<Sheet> get(String sheet) {
        var wikiOpt = wikiDao.basic(sheet);
        if (wikiOpt.isEmpty()) return Optional.empty();
        var wiki = wikiOpt.get();
        if (!wiki.getType().equals("sheet")) return Optional.empty();
        var sheetBuilder = Sheet.builder();
        var cols = colDao.list(sheet);
        sheetBuilder.cols(cols);
        var rows = rowDao.list(sheet);
        sheetBuilder.rows(rows);
        var cells = cellDao.list(sheet);
        sheetBuilder.cells(cells);
        var _sheet = sheetBuilder.build();
        return Optional.of(_sheet);
    }

}
