import Nav from '@/components/nav/Nav';
import "@/components/common/CommonStyle.css";
import "./style.css";

export default (props: any) => {

  return (
  <div>
    <div className='header'>
      <Nav />
    </div>
    <div className='body'>
      {props.children}
    </div>
  </div>
  );
}
