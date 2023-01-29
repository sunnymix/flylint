package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.gateway.dao.wiki.WikiDao;
import com.sunnymix.flylint.api.model.sheet.Sheet;
import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.api.model.sheet.col.MoveCol;
import com.sunnymix.flylint.api.model.sheet.col.RemoveCol;
import com.sunnymix.flylint.api.model.sheet.row.AddRow;
import com.sunnymix.flylint.api.model.sheet.row.MoveRow;
import com.sunnymix.flylint.api.model.sheet.row.RemoveRow;
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
        // TODO: check boundary
        colDao.add(sheet, add);
        cellDao.moveAfterCol(sheet, add.getAfterCol(), add.getSize());
    }

    @Transactional
    public void addRow(String sheet, AddRow add) {
        // TODO: check boundary
        rowDao.add(sheet, add);
        cellDao.moveAfterRow(sheet, add.getAfterRow(), add.getSize());
    }

    @Transactional
    public boolean moveCol(String sheet, MoveCol move) {
        // TODO: check boundary
        var moveCol = colDao.moveOne(sheet, move);
        if (!moveCol) return false;
        return cellDao.moveCol(sheet, move);
    }

    @Transactional
    public boolean moveRow(String sheet, MoveRow move) {
        // TODO: check boundary
        var moveRow = rowDao.moveOne(sheet, move);
        if (!moveRow) return false;
        return cellDao.moveRow(sheet, move);
    }

    @Transactional
    public void removeCol(String sheet, RemoveCol remove) {
        // TODO: check boundary
        colDao.remove(sheet, remove);
        cellDao.removeCol(sheet, remove);
    }

    @Transactional
    public void removeRow(String sheet, RemoveRow remove) {
        // TODO: check boundary
        rowDao.remove(sheet, remove);
        cellDao.removeRow(sheet, remove);
    }

    public void init(String sheet) {
        colDao.add(sheet, AddCol.builder().afterCol(0).size(10).width(200).build());
        rowDao.add(sheet, AddRow.builder().afterRow(0).size(50).height(30).build());
    }

}
