'use client';

import { useState } from 'react';
import { updateProfile, updateEmail } from '@/lib/actions/profile';
import { INCOME_RANGE_LABELS, type IncomeRange } from '@/lib/types/database';

interface EditProfileFormProps {
  fullName: string | null;
  email: string;
  birthDate: string | null;
  incomeRange: IncomeRange | null;
  onClose: () => void;
}

const incomeOptions = Object.entries(INCOME_RANGE_LABELS) as [IncomeRange, string][];

export function EditProfileForm({ fullName, email, birthDate, incomeRange, onClose }: EditProfileFormProps) {
  const [name, setName] = useState(fullName ?? '');
  const [newEmail, setNewEmail] = useState(email);
  const [birth, setBirth] = useState(birthDate ?? '');
  const [income, setIncome] = useState<IncomeRange | ''>(incomeRange ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Update profile fields
    const profileResult = await updateProfile({
      full_name: name,
      birth_date: birth || null,
      income_range: (income || null) as IncomeRange | null,
    });

    if (profileResult.error) {
      setError(profileResult.error);
      setSaving(false);
      return;
    }

    // Update email if changed
    if (newEmail.trim().toLowerCase() !== email.toLowerCase()) {
      const emailResult = await updateEmail(newEmail);
      if (emailResult.error) {
        setError(emailResult.error);
        setSaving(false);
        return;
      }
      setSuccess('Perfil atualizado! ' + (emailResult.message ?? ''));
    } else {
      setSuccess('Perfil atualizado com sucesso!');
    }

    setSaving(false);
    setTimeout(() => {
      onClose();
    }, 1500);
  }

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold">Editar Perfil</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-pulso-text-muted transition-colors hover:bg-pulso-muted hover:text-pulso-text-secondary"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Nome completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2.5 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2.5 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
          {newEmail.trim().toLowerCase() !== email.toLowerCase() && (
            <p className="mt-1 text-[10px] text-amber-500">
              Um email de confirmacao sera enviado para o novo endereco
            </p>
          )}
        </div>

        {/* Birth date */}
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Data de nascimento</label>
          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2.5 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        {/* Income range */}
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Faixa de renda mensal</label>
          <select
            value={income}
            onChange={(e) => setIncome(e.target.value as IncomeRange | '')}
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2.5 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          >
            <option value="">Selecione...</option>
            {incomeOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Messages */}
        {error && (
          <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-500">{error}</p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-600">{success}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alteracoes'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl bg-pulso-muted px-4 py-2.5 text-sm font-medium text-pulso-text-secondary transition-colors hover:bg-pulso-border"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
