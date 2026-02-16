'use client';

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { useToast } from '@/components/ui/toast';

interface EditProfileFormProps {
  currentName: string | null;
}

export function EditProfileForm({ currentName }: EditProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName ?? '');
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set('full_name', name);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        addToast({ type: 'error', title: result.error });
      } else {
        addToast({ type: 'success', title: 'Perfil atualizado!' });
        setIsEditing(false);
      }
    });
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-emerald-400 transition-colors hover:text-emerald-300"
      >
        Editar perfil
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label htmlFor="edit-name" className="mb-1 block text-xs font-medium text-gray-400">
          Nome
        </label>
        <input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setName(currentName ?? '');
          }}
          className="rounded-lg border border-gray-700 px-4 py-2 text-xs text-gray-400 transition-colors hover:bg-gray-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
