package com.sunnymix.flylint.api.model.sheet;

import com.sunnymix.flylint.dao.jooq.tables.pojos.Cell;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Col;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Row;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sheet {

    @Builder.Default
    private List<Col> cols = new ArrayList<>();

    @Builder.Default
    private List<Row> rows = new ArrayList<>();

    @Builder.Default
    private List<Cell> cells = new ArrayList<>();

}
