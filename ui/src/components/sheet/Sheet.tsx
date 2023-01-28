import { useAppSelector, useAppDispatch } from '@/hook/hook';
import counter from '@/store/counter';
const {incremented, decremented, incrementByAmount} = counter.actions;

export default function Sheet() {

  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();
  
  return (
    <div>
      <div>
        <button onClick={() => dispatch(decremented())}>-</button>
        {count}
        <button onClick={() => dispatch(incremented())}>+</button>
        <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
      </div>
      <div>
        peak:
        <Peak />
      </div>
    </div>
    
  );
}

const Peak = () => {
  const count = useAppSelector(state => state.counter.value);

  return (
    <div>{count}</div>
  );
};
