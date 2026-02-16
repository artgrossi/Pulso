import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DiagnosisWizard } from '@/components/onboarding/diagnosis-wizard';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Check if already onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Diagnóstico Financeiro
          </span>
        </h1>
        <p className="text-sm text-gray-400">
          Responda 5 perguntas rápidas para personalizarmos sua jornada
        </p>
      </div>

      <DiagnosisWizard />
    </div>
  );
}
