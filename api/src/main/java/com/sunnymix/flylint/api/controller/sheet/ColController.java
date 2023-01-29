package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.sheet.ColDao;
import com.sunnymix.flylint.api.gateway.dao.sheet.SheetAggreDao;
import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.api.model.sheet.col.MoveCol;
import com.sunnymix.flylint.api.model.sheet.col.RemoveCol;
import com.sunnymix.flylint.api.model.sheet.col.ResizeCol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/sheet/col")
public class ColController {

    @Autowired
    private ColDao colDao;

    @Autowired
    private SheetAggreDao sheetAggreDao;

    @PostMapping("/{sheet}")
    public Out<Void> add(@PathVariable String sheet, @RequestBody AddCol add) {
        // TODO check result
        sheetAggreDao.addCol(sheet, add);
        return Out.ok();
    }

    @PutMapping("/move/{sheet}")
    public Out<Void> move(@PathVariable String sheet, @RequestBody MoveCol move) {
        // TODO check result
        sheetAggreDao.moveCol(sheet, move);
        return Out.ok();
    }

    @PutMapping("/remove/{sheet}")
    public Out<Void> remove(@PathVariable String sheet, @RequestBody RemoveCol remove) {
        // TODO check result
        sheetAggreDao.removeCol(sheet, remove);
        return Out.ok();
    }

    @PutMapping("/resize/{sheet}")
    public Out<Void> resize(@PathVariable String sheet, @RequestBody ResizeCol resize) {
        var ok = colDao.resize(sheet, resize);
        return Out.of(ok);
    }

}
