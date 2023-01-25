import { render } from "./TextCore";

/* __________ text __________ */

const Text = (props: {content?: string}) => {
  const {content} = props;
  const contentUI = render(JSON.parse(content || '[]'))
  return <>{contentUI}</>;
};
export default Text;
