package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.dao.jooq.tables.pojos.Col;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Row;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sunnymix.flylint.dao.jooq.Tables.ROW;

/**
 * @author sunnymix
 */
@Repository
public class RowDao {

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    public List<Row> list(String sheet) {
        var rows = dsl
            .selectFrom(ROW)
            .where(ROW.SHEET.eq(sheet))
            .fetchStreamInto(Row.class)
            .toList();
        return rows;
    }

}
