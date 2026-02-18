import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "./auth-form";
import Logo from "@/components/branding/Logo";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile?.onboarding_completed) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        {/* Hero */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="mb-6 flex justify-center animate-float">
            <Logo variant="icon" size="xl" animated />
          </div>
          <h1 className="mb-2 text-5xl font-bold tracking-tight sm:text-6xl pulso-gradient-text">
            Pulso
          </h1>
          <p className="mb-4 text-lg text-gray-500">
            Bem-estar Financeiro Gamificado
          </p>
          <p className="mx-auto max-w-md text-sm text-gray-400">
            Transforme sua relação com o dinheiro. Acompanhe seus gastos, defina
            metas e evolua suas finanças de forma divertida.
          </p>
        </div>

        {/* Auth */}
        <div className="animate-slide-up delay-200">
          <AuthForm />
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            {
              icon: "🔄",
              title: "Retomada",
              desc: "Organize dívidas e retome o controle",
            },
            {
              icon: "🏗️",
              title: "Fundação",
              desc: "Construa sua reserva de emergência",
            },
            {
              icon: "📈",
              title: "Crescimento",
              desc: "Otimize investimentos e previdência",
            },
            {
              icon: "🎓",
              title: "Expertise",
              desc: "Conteúdo avançado e ferramentas pro",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-slide-up rounded-xl border border-gray-100 bg-white/70 p-6 text-center transition-all hover:shadow-md hover:-translate-y-0.5 delay-${(i + 3) * 100}`}
            >
              <div className="mb-3 text-2xl">{feature.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
