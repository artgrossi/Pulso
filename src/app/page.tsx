import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "./auth-form";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Pulso
            </span>
          </h1>
          <p className="mb-4 text-lg text-gray-400">
            Bem-estar Financeiro Gamificado
          </p>
          <p className="mx-auto max-w-md text-sm text-gray-500">
            Transforme sua relação com o dinheiro. Acompanhe seus gastos, defina
            metas e evolua suas finanças de forma divertida.
          </p>
        </div>

        {/* Auth / Dashboard */}
        {user ? (
          <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
              🎯
            </div>
            <h2 className="mb-1 text-xl font-semibold">
              Bem-vindo de volta!
            </h2>
            <p className="mb-6 text-sm text-gray-400">{user.email}</p>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Sair
              </button>
            </form>
          </div>
        ) : (
          <AuthForm />
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: "📊",
              title: "Acompanhe",
              desc: "Visualize seus gastos e receitas em tempo real",
            },
            {
              icon: "🏆",
              title: "Conquiste",
              desc: "Desbloqueie conquistas ao atingir suas metas",
            },
            {
              icon: "📈",
              title: "Evolua",
              desc: "Suba de nível conforme melhora seus hábitos",
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
