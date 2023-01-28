import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
} from '@/components/sheet/SheetApi';

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
    .addCase(fetchSheet.pending, (state: SheetState) => {
      state.status = 'loading';
      state.curCell = undefined;
    })
    .addCase(fetchSheet.fulfilled, (state: SheetState, action) => {
      state.status = 'loaded';
      const newSheet = action.payload as SheetData;
      state.sheet = newSheet.sheet;
      state.cols = newSheet.cols;
      state.rows = newSheet.rows;
      state.cells = newSheet.cells;
      state.curCell = undefined;
    })
  },
});

export const fetchSheet = createAsyncThunk(
  'sheet/fetchSheet',
  async (sheet: string) => await SheetApi.fetchSheet(sheet) as SheetData,
);

export default sheetSlice;
