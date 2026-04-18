"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BookOpen, Edit3, Type, FileText, ClipboardList, Menu, X, GraduationCap, List, BookMarked } from 'lucide-react';
import { MizanProductLogo, MizanLogo } from '@/components/MizanLogo';

const navItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/vocabulary', label: 'Словарь', icon: BookOpen },
  { href: '/verbs', label: 'Все глаголы', icon: List },
  { href: '/conjugation', label: 'Спряжения', icon: Edit3 },
  { href: '/pronouns', label: 'Местоимения', icon: Type },
  { href: '/topics', label: 'Темы', icon: BookMarked },
  { href: '/exam', label: 'Экзамен', icon: GraduationCap },
  { href: '/quiz', label: 'Тест', icon: FileText },
  { href: '/homework', label: 'ДЗ', icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP SIDEBAR — Dark Ink, Mizan Arabiya logo
          Mizan §6.4 + §14 Mobile Patterns
          ═══════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 z-50"
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--mizan-ink)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo — Mizan Arabiya branding */}
        <div className="p-6 pb-4 pt-8">
          <MizanProductLogo context="dark" />
        </div>

        <div className="mx-6 mb-4" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 transition-all"
                style={{
                  color: isActive ? 'var(--mizan-cream)' : 'var(--cream-50)',
                  background: isActive ? 'rgba(165, 136, 126, 0.12)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--mizan-mauve)' : '2px solid transparent',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  minHeight: '48px',
                }}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer branding */}
        <div
          className="px-6 py-4 text-center"
          style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase' as const,
            color: 'var(--cream-30)',
            fontWeight: 700,
          }}
        >
          © 2026 Mizan
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          MOBILE TOP BAR — Logo isolated
          ═══════════════════════════════════════════════ */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-center"
        style={{
          height: '56px',
          background: 'var(--mizan-ink)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <MizanLogo variant="icon" context="dark" size={28} />
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'var(--mizan-cream)',
              }}
            >
              MIZAN
            </span>
            <span className="font-display" style={{ fontSize: '10px', color: 'var(--mizan-mauve)', marginLeft: '6px' }}>
              Arabiya
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION
          Mizan UX Pattern: Fixed bottom bar for fast access
          ═══════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          height: 'max(64px, calc(64px + env(safe-area-inset-bottom)))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'var(--mizan-ink)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full pt-1"
              style={{
                color: isActive ? 'var(--mizan-cream)' : 'var(--cream-50)',
                background: isActive ? 'rgba(165, 136, 126, 0.08)' : 'transparent',
              }}
            >
              <item.icon size={18} className="mb-1" strokeWidth={isActive ? 2 : 1.5} />
              <span
                style={{
                  fontSize: '8px',
                  fontWeight: isActive ? 700 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile top spacer — push content below fixed header */}
      <div className="lg:hidden" style={{ height: '56px' }} />
    </>
  );
}
