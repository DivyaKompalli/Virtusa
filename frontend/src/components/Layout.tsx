import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  const children = <Outlet />;
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 border-r border-slate-200/50 flex flex-col p-4 gap-2 z-50">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white">
            <span
              className="material-symbols-outlined"
              data-icon="medical_services"
            >
              medical_services
            </span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-cyan-900 tracking-tight leading-none">
              Precision Auth
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
              Clinical Admin v2.4
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="dashboard"
            >
              dashboard
            </span>
            <span className="font-manrope text-sm">Dashboard</span>
          </NavLink>
          <NavLink
            to="/clinical"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="description"
            >
              description
            </span>
            <span className="font-manrope text-sm">Clinical Data</span>
          </NavLink>
          <NavLink
            to="/policy"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="rule_folder"
            >
              rule_folder
            </span>
            <span className="font-manrope text-sm">Policy Validation</span>
          </NavLink>
          <NavLink
            to="/decision"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="gavel"
            >
              gavel
            </span>
            <span className="font-manrope text-sm">Decisions</span>
          </NavLink>
          <NavLink
            to="/appeal"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="assignment_return"
            >
              assignment_return
            </span>
            <span className="font-manrope text-sm">Appeal Center</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg group ${isActive ? "bg-white text-cyan-700 shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100 hover:translate-x-1 font-medium"}`
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="library_books"
            >
              library_books
            </span>
            <span className="font-manrope text-sm">Policy Library</span>
          </NavLink>
        </nav>
        <div className="pt-4 border-t border-slate-200/50 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            href="#"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="help_outline"
            >
              help_outline
            </span>
            <span className="font-manrope text-sm font-medium">Support</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            href="#"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="logout"
            >
              logout
            </span>
            <span className="font-manrope text-sm font-medium">Sign Out</span>
          </a>
        </div>
      </aside>
      <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
        <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-200/50 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-secondary-container/30 px-3 py-1 rounded-full border border-outline-variant/20 flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                Pipeline Step 03
              </span>
              <span className="h-1 w-1 bg-primary rounded-full"></span>
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                Appeal Resolution
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-cyan-900">
              Clinical Curator
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-manrope tracking-tight">
              <a
                className="text-slate-500 hover:text-cyan-700 transition-colors"
                href="#"
              >
                Guidelines
              </a>
              <a
                className="text-cyan-700 font-semibold border-b-2 border-cyan-700 pb-1"
                href="#"
              >
                Appeals
              </a>
              <a
                className="text-slate-500 hover:text-cyan-700 transition-colors"
                href="#"
              >
                Analytics
              </a>
            </nav>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
                <span
                  className="material-symbols-outlined"
                  data-icon="notifications"
                >
                  notifications
                </span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
                <span
                  className="material-symbols-outlined"
                  data-icon="settings"
                >
                  settings
                </span>
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                <img
                  alt="User profile avatar"
                  data-alt="professional portrait of a female medical administrator in business attire with soft studio lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzM6HH7CUkR6vjjxzIXBH2OctipSQEUcMwpEeExhSZ_xY0GSfNeR8iXlcmOZ3KjCs4-q2Rap3pnaV30quULY6V8h-JTBopmhZDvASKxMMHqQp9MljU4rz1lNSiyT9ztJ7jtIvKjtTfGFEU-4j9J3Xc-7WFu-3svOouAz62UJoy2sWKyvYaCUxBPm55kk86V_tPSD6xmPBYJmlA9OTX3S4utw51F-kfJPvCRwj7AdM0wrAeWfExjhgG2nFfpH1shA8JiFpAoen75q8"
                />
              </div>
            </div>
            <button className="tonal-gradient text-white px-5 py-2 rounded-lg text-sm font-manrope font-bold shadow-md active:scale-[0.98] transition-all flex items-center gap-2">
              <span
                className="material-symbols-outlined text-sm"
                data-icon="add"
              >
                add
              </span>
              New Request
            </button>
          </div>
        </header>
        <div className="layout-content">{children}</div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 px-4 z-50">
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Dash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-cyan-700">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_circle
          </span>
          <span className="text-[10px] font-bold">New</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">library_books</span>
          <span className="text-[10px] font-bold">Policy</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
