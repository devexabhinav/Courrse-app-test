'use client';

import { useAppDispatch, useAppSelector } from '@/store'; // adjust path as needed
import { increment, decrement, incrementByAmount, reset } from '@/store/slices/userSlice';

export default function CounterPage() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redux Counter</h1>
      <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>{count}</h2>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => dispatch(decrement())}>
          Decrement (-)
        </button>
        <button onClick={() => dispatch(increment())}>
          Increment (+)
        </button>
        <button onClick={() => dispatch(incrementByAmount(5))}>
          Add 5
        </button>
        <button onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>
    </div>
  );
}