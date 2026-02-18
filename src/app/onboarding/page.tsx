import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DiagnosisWizard } from '@/components/onboarding/diagnosis-wizard';
import Logo from '@/components/branding/Logo';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="mb-4 flex justify-center">
            <Logo variant="full" size="md" animated />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight pulso-gradient-text">
            Diagnóstico Financeiro
          </h1>
          <p className="text-sm text-gray-500">
            Responda 5 perguntas rápidas para personalizarmos sua jornada
          </p>
        </div>

        <div className="animate-slide-up delay-200 w-full">
          <DiagnosisWizard />
        </div>
      </div>
    </div>
  );
}
