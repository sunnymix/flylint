package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.sheet.CellDao;
import com.sunnymix.flylint.api.model.sheet.cell.SaveCell;
import com.sunnymix.flylint.api.service.sheet.CellSavingService;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/sheet/cell")
public class CellController {

    @Autowired
    private CellDao cellDao;

    @Autowired
    private CellSavingService cellSavingService;

    @GetMapping("/{sheet}/{col}/{row}")
    public Out<Cell> get(@PathVariable String sheet,
                         @PathVariable Integer col,
                         @PathVariable Integer row) {
        var cell = cellDao.get(sheet, col, row);
        return Out.ok(cell);
    }

    @PostMapping("/{sheet}/{col}/{row}")
    public Out<Void> save(@PathVariable String sheet,
                          @PathVariable Integer col,
                          @PathVariable Integer row,
                          @RequestBody SaveCell saveCell) {
        var success = cellSavingService.save(sheet, col, row, saveCell);
        return Out.of(success);
    }

}
