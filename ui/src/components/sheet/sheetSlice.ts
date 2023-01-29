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
} from '@/components/sheet/SheetApi';
import { store } from '@/store/store';

export type SheetStatus = 'empty' | 'loading' | 'loaded' | 'error';

export interface SheetState {
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
    .addCase(addCols.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(addCols.fulfilled, (state, action) => {
      state.status = 'loaded';
      const e = action.payload as AddCols;
      const newCols = SheetApi.addCols(e.sheet, state.cols, e);
      state.cols = newCols;
      let newCells = SheetApi.moveCellsAfterCol(e.sheet, state.cells, e.afterCol, e.size);
      newCells = SheetApi.arrangeCells(e.sheet, state.cols, state.rows, newCells);
      state.cells = newCells;
    })
    .addCase(addRows.pending, state => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(addRows.fulfilled, (state, action) => {
      state.status = 'loaded';
      const e = action.payload as AddRows;
      const newRows = SheetApi.addRows(e.sheet, state.rows, e);
      state.rows = newRows;
      let newCells = SheetApi.moveCellsAfterRow(e.sheet, state.cells, e.afterRow, e.size);
      newCells = SheetApi.arrangeCells(e.sheet, state.cols, state.rows, newCells);
      state.cells = newCells;
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

export default sheetSlice;
