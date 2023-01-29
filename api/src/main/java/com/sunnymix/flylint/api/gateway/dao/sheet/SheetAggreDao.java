package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.gateway.dao.wiki.WikiDao;
import com.sunnymix.flylint.api.model.sheet.Sheet;
import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.api.model.sheet.row.AddRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
        var s = Sheet.builder();
        s.sheet(sheet);
        var cols = colDao.list(sheet);
        s.cols(cols);
        s.colsSize(cols.size());
        var rows = rowDao.list(sheet);
        s.rows(rows);
        s.rowsSize(rows.size());
        var cells = cellDao.list(sheet);
        s.cells(cells);
        var _sheet = s.build();
        return Optional.of(_sheet);
    }

    @Transactional
    public void addCol(String sheet, AddCol add) {
        colDao.add(sheet, add);
        cellDao.moveAfterCol(sheet, add.getAfterCol(), add.getSize());
    }

    @Transactional
    public void addRow(String sheet, AddRow add) {
        rowDao.add(sheet, add);
        cellDao.moveAfterRow(sheet, add.getAfterRow(), add.getSize());
    }

}
