'use client';

import { useState } from 'react';
import { EditProfileForm } from './edit-profile-form';
import { INCOME_RANGE_LABELS, type IncomeRange } from '@/lib/types/database';
import { Icon, type IconName } from '@/components/ui/Icon';

interface ProfileHeaderProps {
  fullName: string | null;
  email: string;
  memberSince: string;
  birthDate: string | null;
  incomeRange: IncomeRange | null;
  trackName: string | null;
  trackIcon: IconName | null;
  trackColor: string | null;
  trackBgColor: string | null;
  trackBorderColor: string | null;
}

export function ProfileHeader({
  fullName,
  email,
  memberSince,
  birthDate,
  incomeRange,
  trackName,
  trackIcon,
  trackColor,
  trackBgColor,
  trackBorderColor,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const initials = (fullName ?? 'U')
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const formattedBirth = birthDate
    ? new Date(birthDate + 'T00:00:00').toLocaleDateString('pt-BR')
    : null;

  if (isEditing) {
    return (
      <EditProfileForm
        fullName={fullName}
        email={email}
        birthDate={birthDate}
        incomeRange={incomeRange}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-3xl font-bold text-white shadow-lg shadow-emerald-500/20">
            {initials || '?'}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pulso-elevated shadow-sm border border-pulso-border-subtle">
            <Icon name={trackIcon ?? 'target'} size={14} className={trackColor ?? 'text-pulso-text-secondary'} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{fullName || 'Usuario'}</h2>
              <p className="text-sm text-pulso-text-secondary truncate">{email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-shrink-0 rounded-lg bg-pulso-muted px-3 py-1.5 text-xs font-medium text-pulso-text-secondary transition-colors hover:bg-pulso-muted border border-pulso-border"
            >
              Editar
            </button>
          </div>

          {/* Details row */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-xs text-pulso-text-muted">Membro desde {memberSince}</span>
            {formattedBirth && (
              <>
                <span className="text-xs text-pulso-text-muted">|</span>
                <span className="text-xs text-pulso-text-muted">Nasc. {formattedBirth}</span>
              </>
            )}
            {incomeRange && (
              <>
                <span className="text-xs text-pulso-text-muted">|</span>
                <span className="text-xs text-pulso-text-muted">{INCOME_RANGE_LABELS[incomeRange]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Track badge */}
      {trackName && trackColor && trackBgColor && trackBorderColor && (
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full ${trackBgColor} ${trackBorderColor} border px-3 py-1.5`}>
          <Icon name={trackIcon!} size={16} className={trackColor!} />
          <span className={`text-sm font-medium ${trackColor}`}>Trilha {trackName}</span>
        </div>
      )}
    </div>
  );
}
