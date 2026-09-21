import React from 'react';

export default function Arrow({ direction = 'right' }) {
  const paths = {
    right: 'M4 12h16m-6-6 6 6-6 6',
    left: 'M20 12H4m6-6-6 6 6 6',
    diagonal: 'M5 19 19 5M5 5h14v14',
    'rotate-left': 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
    'rotate-right': 'M20 10a8 8 0 1 0-1 8m1-14v6h-6',
  };
  return <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[direction] || paths.right}/></svg>;
}
