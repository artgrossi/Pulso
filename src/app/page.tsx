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
    // Check if onboarding is complete
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Logo variant="full" size="xl" animated />
          </div>
          <p className="mb-4 text-lg text-gray-400">
            Bem-estar Financeiro Gamificado
          </p>
          <p className="mx-auto max-w-md text-sm text-gray-500">
            Transforme sua relação com o dinheiro. Acompanhe seus gastos, defina
            metas e evolua suas finanças de forma divertida.
          </p>
        </div>

        {/* Auth */}
        <AuthForm />

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-4">
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
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-800/50 bg-gray-900/30 p-6 text-center"
            >
              <div className="mb-3 text-2xl">{feature.icon}</div>
              <h3 className="mb-1 text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
