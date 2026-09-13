import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Container from '../common/Container';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-[var(--color-brass-400)]' : 'text-parchment-100/85 hover:text-white'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-pine-950)]">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-parchment-100" onClick={() => setOpen(false)}>
          <Compass className="size-6 text-[var(--color-brass-500)]" aria-hidden="true" />
          <span className="font-display text-lg font-semibold tracking-tight">Natours</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/tours" className={navLinkClass}>
            Tours
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/me"
                className="flex items-center gap-2 text-sm font-medium text-parchment-100/90 hover:text-white"
              >
                <Avatar name={user?.name} photo={user?.photo} size={28} variant="dark" className="ring-1 ring-white/20" />
                {user?.name?.split(' ')[0] ?? 'Profile'}
              </Link>
              <Button variant="outline" className="border-parchment-100/25 text-parchment-100 hover:bg-white/10" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-parchment-100/85 hover:text-white">
                Log in
              </Link>
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="text-parchment-100 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/10 bg-[var(--color-pine-950)] md:hidden"
            aria-label="Primary"
          >
            <Container className="flex flex-col gap-4 py-5">
              <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/tours" className={navLinkClass} onClick={() => setOpen(false)}>
                Tours
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/me" className={navLinkClass} onClick={() => setOpen(false)}>
                    Profile
                  </NavLink>
                  <Button variant="outline" className="w-fit border-parchment-100/25 text-parchment-100" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                    Log in
                  </NavLink>
                  <Button variant="primary" className="w-fit" onClick={() => { setOpen(false); navigate('/signup'); }}>
                    Sign up
                  </Button>
                </>
              )}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
