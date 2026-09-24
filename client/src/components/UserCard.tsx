import React, { useState } from 'react';
import { User } from '../types';
import { Sparkles, MapPin, Calendar, Check } from 'lucide-react';

interface UserCardProps {
  user: User;
  selectedHobbies?: string[];
  selectedNationalities?: string[];
  onHobbyClick?: (hobby: string) => void;
  onNationalityClick?: (nationality: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  selectedHobbies = [],
  selectedNationalities = [],
  onHobbyClick,
  onNationalityClick,
}) => {
  const [showAllHobbies, setShowAllHobbies] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sortedHobbies = [
    ...user.hobbies.filter((h) => selectedHobbies.includes(h)),
    ...user.hobbies.filter((h) => !selectedHobbies.includes(h)),
  ];
  const displayedHobbies = sortedHobbies.slice(0, 2);
  const remainingHobbies = sortedHobbies.slice(2);
  const remainingCount = remainingHobbies.length;

  const isNatSelected = selectedNationalities.includes(user.nationality);

  return (
    <div className="user-card p-4 relative flex flex-col justify-between h-full group">
      {/* Top section: Avatar + Details */}
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {!imgError ? (
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              className="avatar-img w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/80 shadow-xs"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
          )}
        </div>

        {/* Name, Nationality, Age */}
        <div className="flex-1 min-w-0">
          <h3 className="user-name text-base font-bold text-slate-900 truncate flex items-center gap-1.5" title={`${user.first_name} ${user.last_name}`}>
            <span>{user.first_name}</span>
            <span>{user.last_name}</span>
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <button
              type="button"
              onClick={() => onNationalityClick?.(user.nationality)}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer text-left truncate ${
                isNatSelected ? 'font-semibold text-blue-600' : ''
              }`}
              title={`Filter by nationality: ${user.nationality}`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{user.nationality}</span>
            </button>

            <span className="flex items-center gap-1 shrink-0 text-slate-500 font-medium ml-2">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{user.age} yrs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom section: Hobbies (2 hobbies + n) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 min-h-7.5">
        {displayedHobbies.length > 0 ? (
          <>
            {displayedHobbies.map((hobby) => {
              const isActive = selectedHobbies.includes(hobby);
              return (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => onHobbyClick?.(hobby)}
                  className={`hobby-badge ${isActive ? 'hobby-active' : ''} cursor-pointer`}
                  title={`Filter by hobby: ${hobby}`}
                >
                  {isActive && <Check className="w-3 h-3 mr-1 text-blue-600" />}
                  <span>{hobby}</span>
                </button>
              );
            })}

            {remainingCount > 0 && (
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowAllHobbies(!showAllHobbies)}
                  className="hobby-plus-badge cursor-pointer"
                  title="Click to view all hobbies"
                >
                  +{remainingCount}
                </button>

                {/* Popover showing remaining hobbies */}
                {showAllHobbies && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowAllHobbies(false)}
                    />
                    <div className="absolute left-0 bottom-full mb-2 z-30 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl w-48 border border-slate-700 animate-fade-in text-xs">
                      <p className="font-semibold text-slate-300 mb-1.5 pb-1 border-b border-slate-700">
                        Additional Hobbies ({remainingCount})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {remainingHobbies.map((hobby) => {
                          const isActive = selectedHobbies.includes(hobby);
                          return (
                            <span
                              key={hobby}
                              onClick={() => {
                                onHobbyClick?.(hobby);
                                setShowAllHobbies(false);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                              }`}
                            >
                              {hobby}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <span className="text-xs text-slate-400 italic flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> No hobbies listed
          </span>
        )}
      </div>
    </div>
  );
};
