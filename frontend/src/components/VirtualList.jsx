import { useState, useRef, useCallback, useEffect } from 'react';

export const VirtualList = ({ items, itemHeight, containerHeight, renderItem, overscan = 5 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflowY: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={item._id || item.id || actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const VirtualGrid = ({ items, itemHeight, itemWidth, containerHeight, renderItem, columns = 3, overscan = 2 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const rowCount = Math.ceil(items.length / columns);
  const totalHeight = rowCount * itemHeight;
  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endRow = Math.min(
    rowCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleRows = [];
  for (let row = startRow; row < endRow; row++) {
    const startIndex = row * columns;
    const endIndex = Math.min(items.length, startIndex + columns);
    visibleRows.push({
      row,
      items: items.slice(startIndex, endIndex),
    });
  }

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflowY: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleRows.map(({ row, items: rowItems }) => (
          <div
            key={row}
            style={{
              position: 'absolute',
              top: row * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '1.5rem',
            }}
          >
            {rowItems.map((item, index) => {
              const actualIndex = row * columns + index;
              return (
                <div key={item._id || item.id || actualIndex}>
                  {renderItem(item, actualIndex)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
