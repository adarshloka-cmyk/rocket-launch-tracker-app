import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}) {
  const id = useId();
  const listId = `${id}-listbox`;
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const selected =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handlePointer(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setHighlight(-1);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, []);

  useEffect(() => {
    if (!open) setHighlight(-1);
  }, [open]);

  function selectOption(opt) {
    onChange(opt.value);
    setOpen(false);
    setHighlight(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (highlight >= 0 && options[highlight]) {
        selectOption(options[highlight]);
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
      setHighlight((i) => Math.min(i + 1, options.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlight(options.length - 1);
        return;
      }
      setHighlight((i) => Math.max(i - 1, 0));
    }
  }

  return (
    <div
      ref={rootRef}
      className={`ls-select ${className} ${open ? "is-open" : ""}`}
    >
      <span id={`${id}-label`} className="visually-hidden">
        {label}
      </span>

      <button
        type="button"
        className="ls-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span className="ls-select__value">{selected?.label}</span>
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="ls-select__menu"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: -6, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -4, scale: 0.98 }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {options.map((opt, index) => {
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
                  {opt.label}
                  {isSelected && (
                    <span className="ls-select__check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
