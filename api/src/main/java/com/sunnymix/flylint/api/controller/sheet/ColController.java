package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.gateway.dao.sheet.ColDao;
import com.sunnymix.flylint.api.model.sheet.col.AddCol;
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

    @PostMapping("/{sheet}")
    public Out<Void> add(@PathVariable String sheet, @RequestBody AddCol add) {
        colDao.add(sheet, add);
        return Out.ok();
    }

}
