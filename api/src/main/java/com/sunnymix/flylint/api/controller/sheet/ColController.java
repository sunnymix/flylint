package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.sheet.ColDao;
import com.sunnymix.flylint.api.gateway.dao.sheet.SheetAggreDao;
import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.api.model.sheet.col.MoveCol;
import com.sunnymix.flylint.api.model.sheet.col.RemoveCol;
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
        sheetAggreDao.addCol(sheet, add);
        return Out.ok();
    }

    @PutMapping("/move/{sheet}")
    public Out<Void> move(@PathVariable String sheet, @RequestBody MoveCol move) {
        // TODO
        return Out.ok();
    }

    @PutMapping("/remove/{sheet}")
    public Out<Void> remove(@PathVariable String sheet, @RequestBody RemoveCol remove) {
        // TODO
        return Out.ok();
    }

}
