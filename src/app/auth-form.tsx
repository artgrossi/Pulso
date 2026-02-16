"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        window.location.reload();
      }
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900/60 p-8 backdrop-blur-sm">
      <h2 className="mb-6 text-center text-xl font-semibold">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-medium text-gray-400"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-pulso-primary focus:ring-1 focus:ring-pulso-primary"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-medium text-gray-400"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-pulso-primary focus:ring-1 focus:ring-pulso-primary"
          />
        </div>

        {message && (
          <p
            className={`rounded-lg p-3 text-xs ${
              message.type === "error"
                ? "bg-red-500/10 text-red-400"
                : "bg-pulso-primary/10 text-pulso-primary"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl pulso-gradient px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading
            ? "Carregando..."
            : mode === "login"
              ? "Entrar"
              : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500">
        {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage(null);
          }}
          className="text-pulso-primary hover:underline"
        >
          {mode === "login" ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
