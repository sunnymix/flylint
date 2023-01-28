import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Col as ColData,
  Row as RowData,
  Cell as CellData,
} from '@/components/sheet/SheetApi';

export interface SheetState {
  sheet?: string;
  cols: ColData[];
  rows: RowData[];
  cells: CellData[];
  curCell?: CellData;
}

const initialState: SheetState = {
  sheet: undefined,
  cols: [],
  rows: [],
  cells: [],
  curCell: undefined
}

const sheet = createSlice({
  name: 'sheet',
  initialState,
  reducers: {
    
  }
});

export default sheet;
