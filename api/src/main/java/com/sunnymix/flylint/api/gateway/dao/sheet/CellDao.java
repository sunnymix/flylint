package com.sunnymix.flylint.api.gateway.dao.sheet;

import com.sunnymix.flylint.api.common.Strings;
import com.sunnymix.flylint.api.model.sheet.cell.SaveCell;
import com.sunnymix.flylint.api.model.sheet.col.MoveCol;
import com.sunnymix.flylint.api.model.sheet.col.RemoveCol;
import com.sunnymix.flylint.api.model.sheet.row.MoveRow;
import com.sunnymix.flylint.api.model.sheet.row.RemoveRow;
import com.sunnymix.flylint.dao.jooq.tables.pojos.Cell;
import com.sunnymix.flylint.dao.jooq.tables.records.CellRecord;
import lombok.Getter;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.UpdateSetMoreStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static com.sunnymix.flylint.dao.jooq.Tables.CELL;

/**
 * @author sunnymix
 */
@Repository
public class CellDao {

    @Getter
    @Autowired
    @Qualifier("dslContext")
    private DSLContext dsl;

    public List<Cell> list(String sheet) {
        var cells = dsl
            .select(
                CELL.ID,
                CELL.TYPE,
                CELL.SHEET,
                CELL.COL,
                CELL.ROW,
                CELL.COL_SIZE,
                CELL.ROW_SIZE,
                CELL.WIDTH,
                CELL.HEIGHT,
                CELL.CONTENT, /* inline("").as(CELL.CONTENT) */
                CELL.CREATED,
                CELL.UPDATED)
            .from(CELL)
            .where(CELL.SHEET.eq(sheet))
            .fetchStreamInto(Cell.class)
            .toList();
        return cells;
    }

    public Boolean isCellValid(String sheet, Integer col, Integer row) {
        if (Strings.isEmpty(sheet)) return false;
        if (col < 1) return false;
        if (row < 1) return false;
        return true;
    }

    public Optional<Cell> get(String sheet, Integer col, Integer row) {
        if (!isCellValid(sheet, col, row)) return Optional.empty();
        return dsl
            .selectFrom(CELL)
            .where(_makeCondition(sheet, col, row))
            .limit(1)
            .fetchOptionalInto(Cell.class);
    }

    public boolean create(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!isCellValid(sheet, col, row)) return false;
        var recordOpt = _makeRecord(sheet, col, row, saveCell);
        if (recordOpt.isEmpty()) return false;
        dsl.executeInsert(recordOpt.get());
        return true;
    }

    public boolean update(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!isCellValid(sheet, col, row)) return false;
        var init = dsl.update(CELL);
        UpdateSetMoreStep<CellRecord> update = null;
        if (saveCell.getColSize().isPresent()) {
            update = init.set(CELL.COL_SIZE, saveCell.getColSize().get());
        }
        if (saveCell.getRowSize().isPresent()) {
            update = (update != null ? update : init).set(CELL.ROW_SIZE, saveCell.getRowSize().get());
        }
        if (saveCell.getWidth().isPresent()) {
            update = (update != null ? update : init).set(CELL.WIDTH, saveCell.getWidth().get());
        }
        if (saveCell.getHeight().isPresent()) {
            update = (update != null ? update : init).set(CELL.HEIGHT, saveCell.getHeight().get());
        }
        if (saveCell.getContent().isPresent()) {
            update = (update != null ? update : init).set(CELL.CONTENT, saveCell.getContent().get());
        }
        if (update == null) return false;
        update.where(_makeCondition(sheet, col, row)).execute();
        return true;
    }

    private Optional<CellRecord> _makeRecord(String sheet, Integer col, Integer row, SaveCell saveCell) {
        if (!isCellValid(sheet, col, row)) return Optional.empty();
        var record = new CellRecord();
        record.setId(null);
        record.setType("cell");
        record.setSheet(sheet);
        record.setCol(col);
        record.setRow(row);
        record.setColSize(saveCell.getColSize().orElse(1));
        record.setRowSize(saveCell.getRowSize().orElse(1));
        record.setWidth(saveCell.getWidth().orElse(250));
        record.setHeight(saveCell.getHeight().orElse(30));
        record.setContent(saveCell.getContent().orElse(""));
        record.setCreated(OffsetDateTime.now());
        record.setUpdated(OffsetDateTime.now());
        return Optional.of(record);
    }

    private Condition _makeCondition(String sheet, Integer col, Integer row) {
        return CELL.SHEET.eq(sheet).and(CELL.COL.eq(col)).and(CELL.ROW.eq(row));
    }

    public void moveAfterCol(String sheet, Integer afterCol, Integer moveSize) {
        dsl
            .update(CELL)
            .set(CELL.COL, CELL.COL.add(moveSize))
            .where(CELL.SHEET.eq(sheet).and(CELL.COL.gt(afterCol)))
            .execute();
    }

    public void moveAfterRow(String sheet, Integer afterRow, Integer moveSize) {
        dsl
            .update(CELL)
            .set(CELL.ROW, CELL.ROW.add(moveSize))
            .where(CELL.SHEET.eq(sheet).and(CELL.ROW.gt(afterRow)))
            .execute();
    }

    /* __________ move col __________ */

    public boolean moveCol(String sheet, MoveCol move) {
        var col = move.getCol();
        var toCol = move.getToCol();
        if (toCol < 1) return false;
        if (toCol.equals(col)) return false;
        if (toCol < col) return moveColForward(sheet, col, toCol);
        return moveColBackward(sheet, col, toCol);
    }

    /* __________ move col: helpers __________ */

    private boolean moveColForward(String sheet, Integer col, Integer toCol) {
        // EG: col:4 >> toCol:1
        if (toCol >= col) return true;
        // move to negative:
        moveColToNegative(sheet, col, toCol); // EG: 4 >> -1
        // move section backward with 1:
        moveColSectionBackwardWithSize(sheet, toCol, Optional.of(col - 1), 1); // EG: [1, 4-1] >> +1
        // move to positive:
        moveColToPositive(sheet, toCol); // EG: -1 >> 1
        return true;
    }

    private boolean moveColBackward(String sheet, Integer col, Integer toCol) {
        // EG: col:1 >> toCol:4
        if (toCol <= col) return true;
        // move to negative:
        moveColToNegative(sheet, col, toCol); // EG: 1 >> -4
        // move section forward with 1:
        moveColSectionForwardWithSize(sheet, col + 1, Optional.of(toCol), 1); // EG: [1+1, 4] << -1
        // move to positive:
        moveColToPositive(sheet, toCol); // EG: -4 >> 4
        return true;
    }

    private void moveColToNegative(String sheet, Integer col, Integer toCol) {
        dsl
            .update(CELL)
            .set(CELL.COL, -toCol)
            .where(CELL.SHEET.eq(sheet).and(CELL.COL.eq(col)))
            .execute();
    }

    private void moveColToPositive(String sheet, Integer col) {
        dsl
            .update(CELL)
            .set(CELL.COL, col)
            .where(CELL.SHEET.eq(sheet).and(CELL.COL.eq(-col)))
            .execute();
    }

    private void moveColSectionForwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        if (start - moveSize < 1) return;
        var condition = CELL.SHEET.eq(sheet).and(CELL.COL.ge(start));
        if (endOpt.isPresent()) condition = condition.and(CELL.COL.le(endOpt.get()));
        dsl
            .update(CELL)
            .set(CELL.COL, CELL.COL.minus(moveSize))
            .where(condition)
            .execute();
    }

    private void moveColSectionBackwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        var condition = CELL.SHEET.eq(sheet).and(CELL.COL.ge(start));
        if (endOpt.isPresent()) condition = condition.and(CELL.COL.le(endOpt.get()));
        dsl
            .update(CELL)
            .set(CELL.COL, CELL.COL.add(moveSize))
            .where(condition)
            .execute();
    }

    /* __________ remove col __________ */

    public void removeCol(String sheet, RemoveCol remove) {
        var col = remove.getCol();
        dsl
            .deleteFrom(CELL)
            .where(CELL.SHEET.eq(sheet).and(CELL.COL.eq(col)))
            .execute();
        dsl
            .update(CELL)
            .set(CELL.COL, CELL.COL.minus(1))
            .where(CELL.SHEET.eq(sheet).and(CELL.COL.gt(col)))
            .execute();
    }

    /* __________ move row __________ */

    public boolean moveRow(String sheet, MoveRow move) {
        var row = move.getRow();
        var toRow = move.getToRow();
        if (toRow < 1) return false;
        if (toRow.equals(row)) return false;
        if (toRow < row) return moveRowForward(sheet, row, toRow);
        return moveRowBackward(sheet, row, toRow);
    }

    /* __________ move row: helpers __________ */

    private boolean moveRowForward(String sheet, Integer row, Integer toRow) {
        // EG: row:4 >> toRow:1
        if (toRow >= row) return true;
        // move to negative:
        moveRowToNegative(sheet, row, toRow); // EG: 4 >> -1
        // move section backward with 1:
        moveRowSectionBackwardWithSize(sheet, toRow, Optional.of(row - 1), 1); // EG: [1, 4-1] >> +1
        // move to positive:
        moveRowToPositive(sheet, toRow); // EG: -1 >> 1
        return true;
    }

    private boolean moveRowBackward(String sheet, Integer row, Integer toRow) {
        // EG: row:1 >> toRow:4
        if (toRow <= row) return true;
        // move to negative:
        moveRowToNegative(sheet, row, toRow); // EG: 1 >> -4
        // move section forward with 1:
        moveRowSectionForwardWithSize(sheet, row + 1, Optional.of(toRow), 1); // EG: [1+1, 4] << -1
        // move to positive:
        moveRowToPositive(sheet, toRow); // EG: -4 >> 4
        return true;
    }

    private void moveRowToNegative(String sheet, Integer row, Integer toRow) {
        dsl
            .update(CELL)
            .set(CELL.ROW, -toRow)
            .where(CELL.SHEET.eq(sheet).and(CELL.ROW.eq(row)))
            .execute();
    }

    private void moveRowToPositive(String sheet, Integer row) {
        dsl
            .update(CELL)
            .set(CELL.ROW, row)
            .where(CELL.SHEET.eq(sheet).and(CELL.ROW.eq(-row)))
            .execute();
    }

    private void moveRowSectionForwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        if (start - moveSize < 1) return;
        var condition = CELL.SHEET.eq(sheet).and(CELL.ROW.ge(start));
        if (endOpt.isPresent()) condition = condition.and(CELL.ROW.le(endOpt.get()));
        dsl
            .update(CELL)
            .set(CELL.ROW, CELL.ROW.minus(moveSize))
            .where(condition)
            .execute();
    }

    private void moveRowSectionBackwardWithSize(String sheet, Integer start, Optional<Integer> endOpt, Integer moveSize) {
        if (endOpt.isPresent() && endOpt.get() < start) return;
        var condition = CELL.SHEET.eq(sheet).and(CELL.ROW.ge(start));
        if (endOpt.isPresent()) condition = condition.and(CELL.ROW.le(endOpt.get()));
        dsl
            .update(CELL)
            .set(CELL.ROW, CELL.ROW.add(moveSize))
            .where(condition)
            .execute();
    }

    /* __________ remove row __________ */

    public void removeRow(String sheet, RemoveRow remove) {
        var row = remove.getRow();
        dsl
            .deleteFrom(CELL)
            .where(CELL.SHEET.eq(sheet).and(CELL.ROW.eq(row)))
            .execute();
        dsl
            .update(CELL)
            .set(CELL.ROW, CELL.ROW.minus(1))
            .where(CELL.SHEET.eq(sheet).and(CELL.ROW.gt(row)))
            .execute();
    }

}
