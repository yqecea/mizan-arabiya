"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  /** CSS selector for the element to highlight */
  selector: string;
  /** Fallback selector for mobile layout */
  mobileSelector?: string;
  /** Title of the tooltip */
  title: string;
  /** Description text */
  description: string;
  /** Position of tooltip relative to highlighted element */
  position: 'top' | 'bottom' | 'left' | 'right';
  /** Mobile-specific position override */
  mobilePosition?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: 'aside nav',
    mobileSelector: 'nav.lg\\:hidden.fixed.bottom-0',
    title: 'Навигация',
    description: 'Здесь все разделы сайта. На мобильных — внизу экрана. Всего 9 модулей для изучения.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/vocabulary"]',
    title: '📖 Словарь',
    description: 'Начните здесь! Изучайте 43 глагола — нажимайте на карточку, чтобы отметить слово как выученное.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/verbs"]',
    title: '📋 Все глаголы',
    description: 'Полная таблица всех 43 глаголов для экзамена. Фильтрация по бабам и статусу освоения. Нажмите на глагол → откроется спряжение.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/conjugation"]',
    title: '✏️ Спряжения',
    description: 'Интерактивные таблицы спряжений. Выберите глагол и время — увидите полную парадигму.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/exam"]',
    title: '🎓 Экзамен',
    description: 'Тренажёр формата реального экзамена! Заполняйте таблицу спряжений. Tab — следующая ячейка. Прогресс сохраняется.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/topics"]',
    title: '📚 Темы',
    description: 'Все 20 тем курса морфологии (сарф) — от прошедшего времени до масдара. Каждая тема с кнопкой "Практика".',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/quiz"]',
    title: '📝 Тест',
    description: 'Быстрый квиз — выбирайте правильный перевод из 4 вариантов. Лучший результат сохраняется.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    selector: '[href="/homework"]',
    title: '📝 Домашние задания',
    description: 'Упражнения для закрепления: переводы, подбор корней, определение времени глагола.',
    position: 'right',
    mobilePosition: 'top',
  },
];

const STORAGE_KEY = 'mizan-tour-completed';

export function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [arrowClass, setArrowClass] = useState('');
  const [showTrigger, setShowTrigger] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if tour was completed
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Show trigger button after a short delay for new users
      const timer = setTimeout(() => setShowTrigger(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const isMobile = useCallback(() => {
    return window.innerWidth < 1024;
  }, []);

  const getStepElement = useCallback((step: TourStep): Element | null => {
    const mobile = isMobile();
    const selector = mobile && step.mobileSelector ? step.mobileSelector : step.selector;

    // For nav item selectors, pick from the correct nav context
    if (step.selector.startsWith('[href=') && !step.mobileSelector) {
      if (mobile) {
        // Get from bottom nav
        const bottomNav = document.querySelector('nav.fixed.bottom-0') as HTMLElement;
        if (bottomNav) {
          const el = bottomNav.querySelector(step.selector);
          if (el) return el;
        }
      } else {
        // Get from sidebar nav
        const sidebarNav = document.querySelector('aside nav');
        if (sidebarNav) {
          const el = sidebarNav.querySelector(step.selector);
          if (el) return el;
        }
      }
    }

    return document.querySelector(selector);
  }, [isMobile]);

  const positionTooltip = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    const el = getStepElement(step);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const mobile = isMobile();
    const pos = mobile && step.mobilePosition ? step.mobilePosition : step.position;
    const tooltipW = 320;
    const tooltipH = 200;
    const gap = 16;

    // Spotlight
    const pad = 6;
    setSpotlightStyle({
      top: rect.top - pad + window.scrollY,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });

    // Scroll element into view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Calculate tooltip position
    let top = 0;
    let left = 0;
    let arrow = '';

    switch (pos) {
      case 'right':
        top = rect.top + window.scrollY + rect.height / 2 - tooltipH / 2;
        left = rect.right + gap;
        arrow = 'arrow-left';
        // If tooltip goes off screen right, flip to bottom
        if (left + tooltipW > window.innerWidth - 20) {
          top = rect.bottom + window.scrollY + gap;
          left = Math.max(20, rect.left + rect.width / 2 - tooltipW / 2);
          arrow = 'arrow-top';
        }
        break;
      case 'left':
        top = rect.top + window.scrollY + rect.height / 2 - tooltipH / 2;
        left = rect.left - tooltipW - gap;
        arrow = 'arrow-right';
        if (left < 20) {
          top = rect.bottom + window.scrollY + gap;
          left = Math.max(20, rect.left);
          arrow = 'arrow-top';
        }
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + gap;
        left = Math.max(20, rect.left + rect.width / 2 - tooltipW / 2);
        arrow = 'arrow-top';
        break;
      case 'top':
        top = rect.top + window.scrollY - tooltipH - gap;
        left = Math.max(20, rect.left + rect.width / 2 - tooltipW / 2);
        arrow = 'arrow-bottom';
        // If tooltip goes off screen top, flip to bottom
        if (top < 10) {
          top = rect.bottom + window.scrollY + gap;
          arrow = 'arrow-top';
        }
        break;
    }

    // Clamp to viewport
    left = Math.min(left, window.innerWidth - tooltipW - 20);
    left = Math.max(20, left);

    setTooltipStyle({ top, left, width: tooltipW });
    setArrowClass(arrow);
  }, [currentStep, getStepElement, isMobile]);

  useEffect(() => {
    if (!isActive) return;
    // Small delay for DOM to settle after scroll
    const timer = setTimeout(positionTooltip, 100);
    window.addEventListener('resize', positionTooltip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [isActive, currentStep, positionTooltip]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    setShowTrigger(false);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowTrigger(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endTour();
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, nextStep, prevStep, endTour]);

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Trigger Button — floating */}
      {showTrigger && !isActive && (
        <button
          onClick={startTour}
          className="fixed z-[9999] flex items-center gap-2 animate-fade-slide-up"
          style={{
            bottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))',
            right: '20px',
            padding: '12px 20px',
            background: 'var(--mizan-deep)',
            color: 'var(--mizan-cream)',
            border: '2px solid var(--mizan-mauve)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            cursor: 'pointer',
            boxShadow: '4px 4px 0 0 var(--mizan-mauve)',
          }}
          aria-label="Начать экскурсию по сайту"
        >
          <Sparkles size={16} />
          Экскурсия по сайту
        </button>
      )}

      {/* Tour Overlay */}
      {isActive && (
        <div className="fixed inset-0 z-[10000]" style={{ pointerEvents: 'none' }}>
          {/* Semi-transparent backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(26, 30, 35, 0.7)',
              pointerEvents: 'auto',
            }}
            onClick={endTour}
          />

          {/* Spotlight cutout */}
          <div
            className="absolute transition-all duration-300 ease-out"
            style={{
              ...spotlightStyle,
              border: '2px solid var(--mizan-mauve)',
              boxShadow: '0 0 0 9999px rgba(26, 30, 35, 0.7), 0 0 20px rgba(165, 136, 126, 0.3)',
              pointerEvents: 'none',
              zIndex: 10001,
            }}
          />

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className={`absolute tour-tooltip ${arrowClass}`}
            style={{
              ...tooltipStyle,
              pointerEvents: 'auto',
              zIndex: 10002,
              background: 'var(--mizan-ink)',
              border: '2px solid var(--mizan-mauve)',
              padding: '20px',
              boxShadow: '6px 6px 0 0 rgba(165, 136, 126, 0.3)',
              animation: 'tourFadeIn 0.25s ease-out',
            }}
          >
            {/* Step counter */}
            <div
              className="flex items-center justify-between mb-3"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: 'var(--mizan-mauve)',
              }}
            >
              <span>Шаг {currentStep + 1} из {TOUR_STEPS.length}</span>
              <button
                onClick={endTour}
                style={{ color: 'var(--cream-50)', cursor: 'pointer', background: 'none', border: 'none' }}
                aria-label="Закрыть экскурсию"
              >
                <X size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%`,
                  background: 'var(--mizan-mauve)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Content */}
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: 900,
                color: 'var(--mizan-cream)',
                marginBottom: '8px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--cream-60)',
                lineHeight: '1.6',
                marginBottom: '20px',
                fontWeight: 300,
              }}
            >
              {step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={endTour}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--cream-50)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Пропустить
              </button>
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--mizan-cream)',
                      cursor: 'pointer',
                    }}
                    aria-label="Предыдущий шаг"
                  >
                    <ChevronLeft size={14} />
                  </button>
                )}
                <button
                  onClick={nextStep}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'var(--mizan-mauve)',
                    color: 'var(--mizan-cream)',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    cursor: 'pointer',
                  }}
                >
                  {currentStep === TOUR_STEPS.length - 1 ? 'Готово!' : 'Далее'}
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Manual trigger button — can be placed anywhere */
export function TourTrigger() {
  const [, forceUpdate] = useState(0);

  const startTour = () => {
    localStorage.removeItem(STORAGE_KEY);
    // Dispatch custom event to trigger tour
    window.dispatchEvent(new CustomEvent('mizan-start-tour'));
    forceUpdate(n => n + 1);
  };

  return (
    <button
      onClick={startTour}
      className="flex items-center gap-2"
      style={{
        padding: '8px 14px',
        background: 'var(--mauve-10)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        cursor: 'pointer',
      }}
    >
      <Sparkles size={12} />
      Экскурсия
    </button>
  );
}
