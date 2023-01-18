package com.sunnymix.flylint.api.controller.sheet;

import com.sunnymix.flylint.api.common.io.Out;
import com.sunnymix.flylint.api.model.sheet.Sheet;
import com.sunnymix.flylint.api.service.sheet.SheetGettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sunnymix
 */
@RestController
@RequestMapping("/sheet")
public class SheetController {

    @Autowired
    private SheetGettingService gettingService;

    @GetMapping("/{sheet}")
    public Out<Sheet> get(@PathVariable String sheet) {
        var sheetRes = gettingService.get(sheet);
        return Out.of(sheetRes);
    }

}
