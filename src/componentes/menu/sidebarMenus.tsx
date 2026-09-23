import React, { useEffect, useRef, useState } from "react";
import { menuItems } from "./menuItems-definicion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoles, getUsuarioId } from "../../utils/auth";
import { navigationGuard } from "../../utils/navigation-guard";

interface SidebarMenusProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function SidebarMenus({ isOpen, onClose, onOpen }: SidebarMenusProps) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const userRoles: number[] = getUsuarioId() ? getRoles() : [];

  const getMenuPositionStyle = (buttonTop: number): React.CSSProperties => {
    const vh = window.innerHeight;
    const third = vh / 3;

    if (buttonTop < third) return { top: `${buttonTop}px` };
    if (buttonTop < third * 2) {
      return { top: `${buttonTop}px`, transform: "translateY(-33%)" };
    }
    return { bottom: `${vh - buttonTop}px` };
  };

  const toggleMenu = (label: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top });
    setActiveMenu(activeMenu === label ? null : label);
    setActiveSubMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setActiveSubMenu(activeSubMenu === label ? null : label);
  };

  const handleNavigate = (path?: string) => {
    if (!path || !navigationGuard.check()) return;

    navigate(path);
    setActiveMenu(null);
    setActiveSubMenu(null);

    if (isMobile) onClose();
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!activeMenu) return;
      const button = buttonRefs.current[activeMenu];
      if (button) setMenuPosition({ top: button.getBoundingClientRect().top });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeMenu]);

  const canShow = (item: any) => {
    const visibleMobile = item.visibleOnMobile !== false || !isMobile;
    const hasRole = !item.roles || item.roles.some((role: number) => userRoles.includes(role));
    return visibleMobile && hasRole;
  };

  const mainButtonClass = (isActive: boolean) =>
    `flex h-14 w-14 items-center justify-center rounded-2xl !bg-white !text-slate-900 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg ${
      isActive ? "ring-2 ring-blue-400 ring-offset-2" : ""
    }`;

  const submenuButtonClass =
    "flex w-full items-center gap-3 rounded-xl !bg-white !text-slate-900 px-4 py-3 text-left transition-colors hover:!bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400";

  return (
    <div className="relative flex w-20 flex-col items-center bg-[#0b1623] py-4 text-white">
      <div ref={scrollContainerRef} className="scrollbar-custom w-full flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-5 pb-4">
          {menuItems.filter(canShow).map((item) => (
            <div key={item.label} className="relative flex justify-center">
              <button
                ref={(element) => (buttonRefs.current[item.label] = element)}
                onClick={(event) =>
                  item.subMenu ? toggleMenu(item.label, event) : handleNavigate(item.path)
                }
                className={mainButtonClass(activeMenu === item.label)}
                aria-label={item.label}
                title={item.label}
              >
                <item.icon className="h-7 w-7 text-blue-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeMenu && menuItems.find((item) => item.label === activeMenu)?.subMenu && (
        <div
          ref={subMenuRef}
          className="fixed z-[9999] flex min-w-[250px] flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl"
          style={{ left: "5rem", ...getMenuPositionStyle(menuPosition.top) }}
        >
          {menuItems
            .find((item) => item.label === activeMenu)
            ?.subMenu?.filter(canShow)
            .map((sub) => (
              <div key={sub.label} className="relative">
                <button
                  onClick={() => (sub.subMenu ? toggleSubMenu(sub.label) : handleNavigate(sub.path))}
                  className={submenuButtonClass}
                >
                  <sub.icon className="h-6 w-6 shrink-0 text-blue-600" />
                  <span className="flex-1 text-base font-medium">{sub.label}</span>
                  {sub.subMenu && (
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${
                        activeSubMenu === sub.label ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                {activeSubMenu === sub.label && sub.subMenu && (
                  <div
                    className="absolute left-full z-[9999] ml-1 flex min-w-[220px] flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl"
                    style={(() => {
                      const third = window.innerHeight / 3;
                      if (menuPosition.top < third) return { top: 0 };
                      if (menuPosition.top < third * 2) {
                        return { top: "50%", transform: "translateY(-50%)" };
                      }
                      return { bottom: 0 };
                    })()}
                  >
                    {sub.subMenu.filter(canShow).map((sub2) => (
                      <button
                        key={sub2.label}
                        onClick={() => handleNavigate(sub2.path)}
                        className={submenuButtonClass}
                      >
                        <sub2.icon className="h-5 w-5 shrink-0 text-blue-600" />
                        <span className="text-sm font-medium">{sub2.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
