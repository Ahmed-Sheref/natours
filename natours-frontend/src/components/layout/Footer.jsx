import { Link } from 'react-router-dom';
import { Compass, Globe, AtSign, Mail } from 'lucide-react';
import Container from '../common/Container';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-pine-950)] text-parchment-100/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-parchment-100">
            <Compass className="size-5 text-[var(--color-brass-500)]" aria-hidden="true" />
            <span className="font-display text-base font-semibold">Natours</span>
          </Link>
          <p className="mt-3 max-w-[22ch] text-sm">
            Small-group expeditions on foot, by sea, and through snow.
          </p>
        </div>

        <nav aria-label="Explore">
          <h3 className="mb-3 text-sm font-semibold text-parchment-100">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/tours" className="hover:text-white">All tours</Link></li>
            <li><Link to="/signup" className="hover:text-white">Create an account</Link></li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <h3 className="mb-3 text-sm font-semibold text-parchment-100">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Log in</Link></li>
            <li><Link to="/me" className="hover:text-white">My profile</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-parchment-100">Follow along</h3>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="hover:text-white"><AtSign className="size-5" aria-hidden="true" /></a>
            <a href="#" aria-label="Newsletter" className="hover:text-white"><Mail className="size-5" aria-hidden="true" /></a>
            <a href="#" aria-label="Website" className="hover:text-white"><Globe className="size-5" aria-hidden="true" /></a>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="text-xs text-parchment-100/60">
          © {new Date().getFullYear()} Natours. Built for learning purposes.
        </Container>
      </div>
    </footer>
  );
}
