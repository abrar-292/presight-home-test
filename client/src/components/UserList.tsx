import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { User } from '../types';
import { UserCard } from './UserCard';
import { Loader2 } from 'lucide-react';

interface UserListProps {
  users: User[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbyClick: (hobby: string) => void;
  onNationalityClick: (nationality: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isFetchingNextPage: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedHobbies,
  selectedNationalities,
  onHobbyClick,
  onNationalityClick,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>(3);

  // Responsive column detection based on parent container width
  useEffect(() => {
    const updateColumns = () => {
      if (!parentRef.current) return;
      const width = parentRef.current.clientWidth;
      if (width < 600) {
        setColumns(1);
      } else if (width < 1000) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const rowCount = useMemo(() => Math.ceil(users.length / columns), [users.length, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 155,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= rowCount - 2 && hasMore && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [virtualItems, rowCount, hasMore, isFetchingNextPage, onLoadMore]);

  return (
    <div
      ref={parentRef}
      className="flex-1 w-full h-[calc(100vh-250px)] min-h-125 overflow-y-auto pr-1 relative"
    >
      <div
        className="w-full relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowUsers = users.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute top-0 left-0 w-full pb-3.5"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-3.5"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    selectedHobbies={selectedHobbies}
                    selectedNationalities={selectedNationalities}
                    onHobbyClick={onHobbyClick}
                    onNationalityClick={onNationalityClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Footer Loader */}
      {isFetchingNextPage && (
        <div className="py-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading more users...</span>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className="py-6 text-center text-xs text-slate-400 font-medium">
          You have reached the end of {users.length} profiles
        </div>
      )}
    </div>
  );
};
