import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MENU_Z_INDEX = 10050;
const MENU_GAP = 8;
const VIEWPORT_PAD = 12;

function Chevron({ open }) {
  return (
    <svg
      className={`ls-select__chevron ${open ? "is-open" : ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function OptionRow({ opt, isSelected, isHighlighted }) {
  return (
    <>
      <span className="ls-select__option-main">
        {opt.thumbnail ? (
          <span className="ls-select__thumb-wrap">
            <img
              className="ls-select__thumb"
              src={opt.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
        ) : opt.icon ? (
          <span className="ls-select__thumb-wrap ls-select__thumb-wrap--icon">
            {opt.icon}
          </span>
        ) : null}
        <span className="ls-select__option-text">
          <span className="ls-select__option-label">{opt.label}</span>
          {opt.subtitle && (
            <span className="ls-select__option-sub">{opt.subtitle}</span>
          )}
        </span>
      </span>
      {isSelected && (
        <span className="ls-select__check" aria-hidden="true">
          ✓
        </span>
      )}
    </>
  );
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  searchable = false,
  searchPlaceholder = "Search…",
  placement = "bottom",
}) {
  const id = useId();
  const listId = `${id}-listbox`;
  const prefersReducedMotion = useReducedMotion();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [query, setQuery] = useState("");
  const [menuRect, setMenuRect] = useState(null);
  const [flipAbove, setFlipAbove] = useState(false);

  const selected =
    options.find((opt) => opt.value === value) || options[0];

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase().trim();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [options, query, searchable]);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuMax = searchable ? 360 : 300;
    const spaceBelow =
      window.innerHeight - rect.bottom - MENU_GAP - VIEWPORT_PAD;
    const spaceAbove = rect.top - MENU_GAP - VIEWPORT_PAD;
    const shouldFlip =
      placement === "top" ||
      (spaceBelow < 180 && spaceAbove > spaceBelow);

    setFlipAbove(shouldFlip);

    const maxHeight = Math.min(
      menuMax,
      shouldFlip ? spaceAbove : spaceBelow
    );

    setMenuRect({
      top: shouldFlip
        ? rect.top - MENU_GAP
        : rect.bottom + MENU_GAP,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, maxHeight),
      transform: shouldFlip ? "translateY(-100%)" : "none",
    });
  }, [placement]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition, filteredOptions.length]);

  useEffect(() => {
    if (!open) return;

    function onScrollOrResize() {
      updateMenuPosition();
    }

    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlight(-1);
      return;
    }

    updateMenuPosition();
    if (searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable, updateMenuPosition]);

  useEffect(() => {
    function handlePointer(e) {
      const target = e.target;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function selectOption(opt) {
    onChange(opt.value);
    setOpen(false);
    setHighlight(-1);
    setQuery("");
  }

  function handleKeyDown(e) {
    const list = filteredOptions;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      if (searchable && e.target === searchRef.current) return;
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (highlight >= 0 && list[highlight]) {
        selectOption(list[highlight]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlight(0);
        return;
      }
      setHighlight((i) => Math.min(i + 1, list.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlight(list.length - 1);
        return;
      }
      setHighlight((i) => Math.max(i - 1, 0));
    }
  }

  const menu = menuRect
    ? createPortal(
        <AnimatePresence
          onExitComplete={() => {
            if (!open) setMenuRect(null);
          }}
        >
          {open && (
            <motion.div
              ref={menuRef}
              key="menu"
              className={`ls-select__menu-portal ${
                flipAbove ? "is-above" : ""
              }`}
              style={{
                position: "fixed",
                top: menuRect.top,
                left: menuRect.left,
                width: menuRect.width,
                maxHeight: menuRect.maxHeight,
                transform: menuRect.transform,
                zIndex: MENU_Z_INDEX,
              }}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, scale: 0.96, y: flipAbove ? 6 : -6 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.97, y: flipAbove ? 4 : -4 }
              }
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
          {searchable && (
            <div className="ls-select__search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                aria-label={`Search ${label}`}
                autoComplete="off"
              />
            </div>
          )}

          <ul
            id={listId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="ls-select__menu"
          >
            {filteredOptions.length === 0 && (
              <li className="ls-select__empty" role="presentation">
                No matches
              </li>
            )}
            {filteredOptions.map((opt, index) => {
              const isSelected = opt.value === value;
              const isHighlighted = index === highlight;

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`ls-select__option ${
                    isSelected ? "is-selected" : ""
                  } ${isHighlighted ? "is-highlighted" : ""}`}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => selectOption(opt)}
                >
                  <OptionRow
                    opt={opt}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                  />
                </li>
              );
            })}
          </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div className={`ls-select ${className} ${open ? "is-open" : ""}`}>
      <span id={`${id}-label`} className="visually-hidden">
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        className="ls-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span className="ls-select__value">{selected?.label}</span>
        <Chevron open={open} />
      </button>

      {menu}
    </div>
  );
}
