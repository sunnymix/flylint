package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.model.sheet.row.AddRow;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Row;
import com.sunnymix.flylint.dao.jooq.tables.records.RowRecord;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
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
            .orderBy(ROW.ROW_)
            .fetchStreamInto(Row.class)
            .toList();
        return rows;
    }

    @Transactional
    public void add(String sheet, AddRow add) {
        moveBackward(sheet, add.getAfterRow(), add.getSize());
        createBatch(sheet, add.getAfterRow(), add.getSize(), add.getHeight());
    }

    public void moveBackward(String sheet, Integer afterRow, Integer size) {
        var startRow = afterRow + 1;
        dsl
            .update(ROW)
            .set(ROW.ROW_, ROW.ROW_.add(size))
            .where(ROW.SHEET.eq(sheet).and(ROW.ROW_.ge(startRow)))
            .execute();
    }

    public void createBatch(String sheet, Integer afterRow, Integer size, Integer height) {
        var startRow = afterRow + 1;
        var records = _buildRecordBatch(sheet, startRow, size, height);
        dsl.batchInsert(records).execute();
    }

    private List<RowRecord> _buildRecordBatch(String sheet, Integer startRow, Integer size, Integer height) {
        List<RowRecord> records = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            records.add(_buildRecord(sheet, startRow + i, height));
        }
        return records;
    }

    private RowRecord _buildRecord(String sheet, Integer row, Integer height) {
        var record = new RowRecord();
        record.setId(null);
        record.setSheet(sheet);
        record.setRow(row);
        record.setHeight(height);
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        return record;
    }

}
