import { useEffect, useRef } from 'react';

export default function IntentSuccessView() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 0.6s ease';
      path.style.strokeDashoffset = '0';
    }
  }, []);

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-[#5B3FD5] to-[#007aff] flex flex-col items-center justify-center text-white px-6 text-center'>
      <div className='bg-white rounded-full p-6 mb-6'>
        <svg
          className='w-16 h-16 text-blue-600'
          fill='none'
          stroke='currentColor'
          strokeWidth={2.5}
          viewBox='0 0 24 24'
        >
          <path
            ref={pathRef}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
      <h1 className='text-xl font-bold mb-2'>Order placed!</h1>
      <p className='text-sm opacity-90'>Your order was placed successfully.</p>
    </div>
  );
}
