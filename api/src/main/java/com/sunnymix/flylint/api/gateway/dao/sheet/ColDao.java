package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Col;
import com.sunnymix.flylint.dao.jooq.tables.records.ColRecord;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
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
            .orderBy(COL.COL_)
            .fetchStreamInto(Col.class)
            .toList();
        return cols;
    }

    @Transactional
    public void add(String sheet, AddCol add) {
        moveBackward(sheet, add.getAfterCol(), add.getSize());
        createBatch(sheet, add.getAfterCol(), add.getSize(), add.getWidth());
    }

    public void moveBackward(String sheet, Integer afterCol, Integer size) {
        var startCol = afterCol + 1;
        dsl
            .update(COL)
            .set(COL.COL_, COL.COL_.add(size))
            .where(COL.SHEET.eq(sheet).and(COL.COL_.ge(startCol)))
            .execute();
    }

    public void createBatch(String sheet, Integer afterCol, Integer size, Integer width) {
        var startCol = afterCol + 1;
        var records = _buildRecordBatch(sheet, startCol, size, width);
        dsl.batchInsert(records).execute();
    }

    private List<ColRecord> _buildRecordBatch(String sheet, Integer startCol, Integer size, Integer width) {
        List<ColRecord> records = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            records.add(_buildRecord(sheet, startCol + i, width));
        }
        return records;
    }

    private ColRecord _buildRecord(String sheet, Integer col, Integer width) {
        var record = new ColRecord();
        record.setId(null);
        record.setSheet(sheet);
        record.setCol(col);
        record.setWidth(width);
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        return record;
    }

}
