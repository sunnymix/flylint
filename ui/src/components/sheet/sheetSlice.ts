import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  defaultWidth,
  defaultHeight,
  AddCols,
  AddRows,
  MoveCol,
  MoveRow,
  RemoveCol,
  RemoveRow,
  ResizeRow,
  ResizeCol,
} from '@/components/sheet/SheetApi';
import { store } from '@/store/store';
import Time from '../common/Time';

export type SheetStatus = 'empty' | 'loading' | 'loaded' | 'error';

export interface SheetState {
  reload?: string,
  status: SheetStatus,
  sheet?: string;
  cols: ColData[];
  rows: RowData[];
  cells: CellData[];
  curCell?: CellData;
};

export interface UpdateCell {
  cell: CellData;
  newCell: CellData;
};

const initialState: SheetState = {
  status: 'empty',
  sheet: undefined,
  cols: [],
  rows: [],
  cells: [],
  curCell: undefined,
};

export const sheetSlice = createSlice({
  name: 'sheet',
  initialState,
  reducers: {
    selectCell: (state: SheetState, action: PayloadAction<CellData>) => {
      state.curCell = action.payload;
    },
    updateCell: (state: SheetState, action: PayloadAction<UpdateCell>) => {
      const newCells = state.cells.map((item: CellData) => {
        if (SheetApi.isSameCell(item, action.payload.cell)) {
          return {
            ...item,
            content: action.payload.newCell.content,
          };
        }
        return item;
      });
      state.cells = newCells;
    },
  },
  extraReducers: (builder) => {
    builder
    /* __________ fetchSheet __________ */
    .addCase(fetchSheet.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(fetchSheet.fulfilled, (state, action) => {
      state.status = 'loaded';
      const newSheet = action.payload as SheetData;
      state.sheet = newSheet.sheet;
      state.cols = newSheet.cols;
      state.rows = newSheet.rows;
      state.cells = newSheet.cells;
      state.curCell = undefined;
    })
    /* __________ addCols __________ */
    .addCase(addCols.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(addCols.fulfilled, (state, action) => {
      state.status = 'loaded';
      const e = action.payload as AddCols;
      state.reload = `${+(new Date())}`;
      return;
      // client hot load:
      const newCols = SheetApi.addCols(e.sheet, state.cols, e);
      state.cols = newCols;
      let newCells = SheetApi.moveCellsAfterCol(e.sheet, state.cells, e.afterCol, e.size);
      newCells = SheetApi.arrangeCells(e.sheet, state.cols, state.rows, newCells);
      state.cells = newCells;
    })
    /* __________ addRows __________ */
    .addCase(addRows.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(addRows.fulfilled, (state, action) => {
      state.status = 'loaded';
      const e = action.payload as AddRows;
      state.reload = `${+(new Date())}`;
      return;
      // client hot load:
      const newRows = SheetApi.addRows(e.sheet, state.rows, e);
      state.rows = newRows;
      let newCells = SheetApi.moveCellsAfterRow(e.sheet, state.cells, e.afterRow, e.size);
      newCells = SheetApi.arrangeCells(e.sheet, state.cols, state.rows, newCells);
      state.cells = newCells;
    })
    /* __________ moveCol __________ */
    .addCase(moveCol.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(moveCol.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
    /* __________ moveRow __________ */
    .addCase(moveRow.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(moveRow.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
    /* __________ removeCol __________ */
    .addCase(removeCol.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(removeCol.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
    /* __________ removeRow __________ */
    .addCase(removeRow.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(removeRow.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
    /* __________ resizeCol __________ */
    .addCase(resizeCol.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(resizeCol.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
    /* __________ resizeRow __________ */
    .addCase(resizeRow.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(resizeRow.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.reload = Time.reloadSignal();
    })
  },
});

export const fetchSheet = createAsyncThunk(
  'sheet/fetchSheet',
  async (sheet: string): Promise<SheetData> => {
    const newSheet = await SheetApi.fetchSheet(sheet) as SheetData;
    return newSheet;
  },
);

export const addCols = createAsyncThunk(
  'sheet/postCols',
  async (e: AddCols): Promise<AddCols|undefined> => {
    const success = await SheetApi.postCols(e);
    return success ? e : undefined;
  },
);

export const addRows = createAsyncThunk(
  'sheet/postRows',
  async (e: AddRows): Promise<AddRows|undefined> => {
    const success = await SheetApi.postRows(e);
    return success ? e : undefined;
  },
);

export const moveCol = createAsyncThunk(
  'sheet/moveCol',
  async (e: MoveCol): Promise<MoveCol|undefined> => {
    const success = await SheetApi.putMoveCol(e);
    return success ? e : undefined;
  },
);

export const moveRow = createAsyncThunk(
  'sheet/moveRow',
  async (e: MoveRow): Promise<MoveRow|undefined> => {
    const success = await SheetApi.putMoveRow(e);
    return success ? e : undefined;
  },
);

export const removeCol = createAsyncThunk(
  'sheet/removeCol',
  async (e: RemoveCol): Promise<RemoveCol|undefined> => {
    const success = await SheetApi.putRemoveCol(e);
    return success ? e : undefined;
  },
);

export const removeRow = createAsyncThunk(
  'sheet/removeRow',
  async (e: RemoveRow): Promise<RemoveRow|undefined> => {
    const success = await SheetApi.putRemoveRow(e);
    return success ? e : undefined;
  },
);

export const resizeCol = createAsyncThunk(
  'sheet/resizeCol',
  async (e: ResizeCol): Promise<ResizeCol|undefined> => {
    const success = await SheetApi.putResizeCol(e);
    return success ? e : undefined;
  },
);

export const resizeRow = createAsyncThunk(
  'sheet/resizeRow',
  async (e: ResizeRow): Promise<ResizeRow|undefined> => {
    const success = await SheetApi.putResizeRow(e);
    return success ? e : undefined;
  },
);

export default sheetSlice;
