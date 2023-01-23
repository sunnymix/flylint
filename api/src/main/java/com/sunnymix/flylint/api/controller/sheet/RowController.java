package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.sheet.RowDao;
import com.sunnymix.flylint.api.model.sheet.col.AddRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/sheet/row")
public class RowController {

    @Autowired
    private RowDao rowDao;

    @PostMapping("/{sheet}")
    public Out<Void> add(@PathVariable String sheet, @RequestBody AddRow add) {
        rowDao.add(sheet, add);
        return Out.ok();
    }

}
