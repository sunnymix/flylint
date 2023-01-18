package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.dao.jooq.tables.pojos.Col;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sunnymix.flylint.dao.jooq.Tables.COL;

/**
 * @author sunnymix
 */
@Repository
public class ColDao {

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    public List<Col> list(String sheet) {
        var cols = dsl
            .selectFrom(COL)
            .where(COL.SHEET.eq(sheet))
            .fetchStreamInto(Col.class)
            .toList();
        return cols;
    }

}
