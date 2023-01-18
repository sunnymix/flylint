package com.sunnymix.flylint.api.service.sheet;

import com.sunnymix.flylint.api.model.sheet.Sheet;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Service
public class SheetGettingService {

    public Optional<Sheet> get(String sheet) {
        return Optional.empty();
    }

}
