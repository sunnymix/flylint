package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.model.sheet.col.AddCol;
import com.sunnymix.flylint.api.model.sheet.col.MoveCol;
import com.sunnymix.flylint.api.model.sheet.col.RemoveCol;
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
import java.util.Optional;

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
        var afterCol = add.getAfterCol();
        var size = add.getSize();
        var width = add.getWidth();
        moveSectionBackwardWithSize(sheet, afterCol + 1, Optional.empty(), size);
        createBatch(sheet, afterCol, size, width);
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

    /* __________ move one __________ */

    public boolean moveOne(String sheet, MoveCol move) {
        var col = move.getCol();
        var toCol = move.getToCol();
        if (col.equals(toCol)) return true;
        if (toCol < col) return moveOneForward(sheet, col, toCol);
        return moveOneBackward(sheet, col, toCol);
    }

    /* __________ move one: helpers __________ */

    private boolean moveOneForward(String sheet, Integer col, Integer toCol) {
        // EG: col:4 >> toCol:1
        if (toCol >= col) return true;
        // move to negative:
        moveToNegative(sheet, col, toCol); // EG: 4 >> -1
        // move section backward with 1:
        moveSectionBackwardWithSize(sheet, toCol, Optional.of(col - 1), 1); // EG: [1, 4-1] >> +1
        // move to positive:
        moveToPositive(sheet, toCol); // EG: -1 >> 1
        return true;
    }

    private boolean moveOneBackward(String sheet, Integer col, Integer toCol) {
        // EG: col:1 >> toCol:4
        if (toCol <= col) return true;
        // move to negative:
        moveToNegative(sheet, col, toCol); // EG: 1 >> -4
        // move section forward with 1:
        moveSectionForwardWithSize(sheet, col + 1, Optional.of(toCol), 1); // EG: [1+1, 4] << -1
        // move to positive:
        moveToPositive(sheet, toCol); // EG: -4 >> 4
        return true;
    }

    private void moveToNegative(String sheet, Integer col, Integer toCol) {
        dsl
            .update(COL)
            .set(COL.COL_, -toCol)
            .where(COL.SHEET.eq(sheet).and(COL.COL_.eq(col)))
            .execute();
    }

    private void moveToPositive(String sheet, Integer col) {
        dsl
            .update(COL)
            .set(COL.COL_, col)
            .where(COL.SHEET.eq(sheet).and(COL.COL_.eq(-col)))
            .execute();
    }

    private void moveSectionForwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() <= start) return;
        if (start - moveSize < 1) return;
        var condition = COL.SHEET.eq(sheet).and(COL.COL_.ge(start));
        endOpt.ifPresent(end -> condition.and(COL.COL_.le(end)));
        dsl
            .update(COL)
            .set(COL.COL_, COL.COL_.minus(moveSize))
            .where(condition)
            .execute();
    }

    private void moveSectionBackwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() <= start) return;
        var condition = COL.SHEET.eq(sheet).and(COL.COL_.ge(start));
        endOpt.ifPresent(end -> condition.and(COL.COL_.le(end)));
        dsl
            .update(COL)
            .set(COL.COL_, COL.COL_.add(moveSize))
            .where(condition)
            .execute();
    }

    /* __________ remove __________ */

    @Transactional
    public void remove(String sheet, RemoveCol remove) {
        var col = remove.getCol();
        dsl
            .deleteFrom(COL)
            .where(COL.SHEET.eq(sheet).and(COL.COL_.eq(col)))
            .execute();
        dsl
            .update(COL)
            .set(COL.COL_, COL.COL_.minus(1))
            .where(COL.SHEET.eq(sheet).and(COL.COL_.gt(col)))
            .execute();
    }

}
