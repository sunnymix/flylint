package com.sunnymix.flylint.api.service;

import com.sunnymix.flylint.api.gateway.dao.CellDao;
import com.sunnymix.flylint.api.model.sheet.cell.SaveCell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author sunnymix
 */
@Service
public class CellSavingService {

    @Autowired
    private CellDao cellDao;

    @Transactional
    public boolean save(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!cellDao.isCellValid(sheet, col, row)) return false;
        var cellOpt = cellDao.get(sheet, col, row);
        if (cellOpt.isEmpty()) return create(sheet, col, row, saveCell);
        return update(sheet, col, row, saveCell);
    }

    public boolean create(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!cellDao.isCellValid(sheet, col, row)) return false;
        return cellDao.create(sheet, col, row, saveCell);
    }

    public boolean update(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!cellDao.isCellValid(sheet, col, row)) return false;
        return cellDao.update(sheet, col, row, saveCell);
    }

}
