package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.model.sheet.row.AddRow;
import com.sunnymix.flylint.api.model.sheet.row.MoveRow;
import com.sunnymix.flylint.api.model.sheet.row.RemoveRow;
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
import java.util.Optional;

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
        var afterRow = add.getAfterRow();
        var size = add.getSize();
        var height = add.getHeight();
        moveSectionBackwardWithSize(sheet, afterRow + 1, Optional.empty(), size);
        createBatch(sheet, afterRow, size, height);
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

    /* __________ move one __________ */

    public boolean moveOne(String sheet, MoveRow move) {
        var row = move.getRow();
        var toRow = move.getToRow();
        if (row.equals(toRow)) return true;
        if (toRow < row) return moveOneForward(sheet, row, toRow);
        return moveOneBackward(sheet, row, toRow);
    }

    /* __________ move one: helpers __________ */

    private boolean moveOneForward(String sheet, Integer row, Integer toRow) {
        // EG: row:4 >> toRow:1
        if (toRow >= row) return true;
        // move to negative:
        moveToNegative(sheet, row, toRow); // EG: 4 >> -1
        // move section backward with 1:
        moveSectionBackwardWithSize(sheet, toRow, Optional.of(row - 1), 1); // EG: [1, 4-1] >> +1
        // move to positive:
        moveToPositive(sheet, toRow); // EG: -1 >> 1
        return true;
    }

    private boolean moveOneBackward(String sheet, Integer row, Integer toRow) {
        // EG: row:1 >> toRow:4
        if (toRow <= row) return true;
        // move to negative:
        moveToNegative(sheet, row, toRow); // EG: 1 >> -4
        // move section forward with 1:
        moveSectionForwardWithSize(sheet, row + 1, Optional.of(toRow), 1); // EG: [1+1, 4] << -1
        // move to positive:
        moveToPositive(sheet, toRow); // EG: -4 >> 4
        return true;
    }

    private void moveToNegative(String sheet, Integer row, Integer toRow) {
        dsl
            .update(ROW)
            .set(ROW.ROW_, -toRow)
            .where(ROW.SHEET.eq(sheet).and(ROW.ROW_.eq(row)))
            .execute();
    }

    private void moveToPositive(String sheet, Integer row) {
        dsl
            .update(ROW)
            .set(ROW.ROW_, row)
            .where(ROW.SHEET.eq(sheet).and(ROW.ROW_.eq(-row)))
            .execute();
    }

    private void moveSectionForwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        if (start - moveSize < 1) return;
        var condition = ROW.SHEET.eq(sheet).and(ROW.ROW_.ge(start));
        if (endOpt.isPresent()) condition = condition.and(ROW.ROW_.le(endOpt.get()));
        dsl
            .update(ROW)
            .set(ROW.ROW_, ROW.ROW_.minus(moveSize))
            .where(condition)
            .execute();
    }

    private void moveSectionBackwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        var condition = ROW.SHEET.eq(sheet).and(ROW.ROW_.ge(start));
        if (endOpt.isPresent()) condition = condition.and(ROW.ROW_.le(endOpt.get()));
        dsl
            .update(ROW)
            .set(ROW.ROW_, ROW.ROW_.add(moveSize))
            .where(condition)
            .execute();
    }

    /* __________ remove __________ */

    public void remove(String sheet, RemoveRow remove) {
        var row = remove.getRow();
        dsl
            .deleteFrom(ROW)
            .where(ROW.SHEET.eq(sheet).and(ROW.ROW_.eq(row)))
            .execute();
        dsl
            .update(ROW)
            .set(ROW.ROW_, ROW.ROW_.minus(1))
            .where(ROW.SHEET.eq(sheet).and(ROW.ROW_.gt(row)))
            .execute();
    }

}
