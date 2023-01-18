package com.sunnymix.flylint.api.service.sheet;

import com.sunnymix.flylint.api.gateway.dao.sheet.SheetAggreDao;
import com.sunnymix.flylint.api.model.sheet.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Service
public class SheetGettingService {

    @Autowired
    private SheetAggreDao sheetAggreDao;

    public Optional<Sheet> get(String sheet) {
        var sheetRes = sheetAggreDao.get(sheet);
        return sheetRes;
    }

}
