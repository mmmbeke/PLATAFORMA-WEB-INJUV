import { useState } from "react";

export default function LoginCanvas() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_600px_at_80%_-20%,rgba(30,64,175,0.2),transparent),radial-gradient(800px_400px_at_10%_110%,rgba(34,211,238,0.13),transparent)] bg-slate-900 text-slate-100 font-sans p-6">
      <main className="w-full max-w-md bg-slate-800/70 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <header className="text-center px-6 pt-6 pb-3 border-b border-slate-700">
          <img
            src="https://www.injuv.gob.cl/sites/default/files/logo_injuv_2021_portal.png?v=3"
            alt="INJUV"
            className="mx-auto w-32 mb-3 drop-shadow"
          />
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-slate-400 text-sm">Accede con tu correo y contraseña</p>
        </header>

        <section className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`(Demo Canvas) Login visual correcto. Rol seleccionado: ${role}. En tu sitio real aquí guardarías el rol y redirigirías a la vista correspondiente.`);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="tuname@dominio.cl"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Tu contraseña"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300"
                  aria-label="Mostrar u ocultar contraseña"
                  title={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Mínimo 8 caracteres.</p>
            </div>

            {/* Selector de rol (solo UI para demo en Canvas) */}
            <div>
              <span className="block text-sm font-medium text-slate-300 mb-1">Rol</span>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${role==='user' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600'}`}>
                  <input type="radio" name="role" value="user" checked={role==='user'} onChange={() => setRole('user')} /> Usuario
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${role==='admin' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-slate-600'}`}>
                  <input type="radio" name="role" value="admin" checked={role==='admin'} onChange={() => setRole('admin')} /> Admin
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${role==='organization' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600'}`}>
                  <input type="radio" name="role" value="organization" checked={role==='organization'} onChange={() => setRole('organization')} /> Organización
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-1">En producción, el backend asigna este rol después del login.</p>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white transition shadow-md"
            >
              Entrar
            </button>

            <button
              type="button"
              disabled
              className="w-full py-2 rounded-lg border border-dashed border-blue-400 text-blue-200 mt-2 font-semibold"
            >
              Acceder con ClaveÚnica
            </button>
          </form>
        </section>

        <footer className="text-center text-sm text-slate-400 px-6 pb-6">
          ¿Sin cuenta? <a href="#" className="text-blue-400 hover:underline">Regístrate</a>
          <br />
          <span className="text-xs opacity-75">Acceso seguro disponible en el sitio</span>
        </footer>
      </main>
    </div>
  );
}
