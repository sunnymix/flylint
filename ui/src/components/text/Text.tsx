import { Cell as CellData } from "../sheet/SheetApi";
import { render } from "./TextCore";

/* __________ text __________ */

const Text = (props: {cell: CellData}) => {
  const {cell} = props;
  const contentUI = render(JSON.parse(cell.content || '[]'))
  // console.log(`* Text | render`);
  return <>{contentUI}</>;
};
export default Text;
