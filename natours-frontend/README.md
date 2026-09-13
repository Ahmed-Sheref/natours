# Natours — CSR Frontend

React + Vite frontend for the Natours backend, built to talk to it purely over REST (no SSR, no Pug).

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your Express API
npm run dev
```

## Required backend changes

Two changes are needed on the Express backend before this frontend can talk to it —
see the two files under `backend-changes/` in the delivery, or the chat message that
came with this project:

1. **CORS** — `index.js` currently has no `cors` middleware, so the browser will block
   every request from Vite's dev origin.
2. **Public tour browsing** — `Routers/TourRouter.js` currently has
   `router.use(authcontroll.protect)` applied to the whole router, which requires a
   JWT even to list or view tours. The patched version only protects the
   create/update/delete routes.

## API contract notes (from auditing the real backend)

- Base URL: `VITE_API_URL` (e.g. `http://localhost:3000/api/v1`)
- **Login only returns `{ token }`** — no user object. `AuthContext` fetches
  `GET /users/me` right after to populate the session.
- **Signup returns `{ token, data: { user } }`.**
- **`updateMe` / `updateMyPassword` / `deleteMe`** each return a different shape
  than the rest of the CRUD endpoints (`{ status, message, newUser }` /
  `{ status, message, token }` / `{ status, message }`). `api/client.js`'s
  `extractData()` and the `features/users` API functions handle this directly
  rather than trying to force one shape.
- **JWT expires in 30 minutes** and there is no refresh-token endpoint. A 401
  anywhere triggers an automatic logout via the Axios interceptor.
- **Reviews' nested route is singular**: `/tours/:tourId/review`, not `/reviews`.
- **Pagination has no total count** — `results` is just the count of the
  current page, so pagination is Previous/Next only (no page numbers), and
  "next page" is inferred from `results === limit`.
- **No `fields` projection** — the backend accepts a `fields` query param but
  the current `handlerFactory.getAll` never applies it, so it's a no-op. Not
  used here.
- **No text search endpoint** — the search box on `/tours` filters the
  *current page* client-side only. It is not full-catalog search.
- **No booking/payment endpoint exists** — the "Book this tour" button on the
  tour details page is a disabled placeholder with an explanatory note,
  not a fake booking flow.
- **`GET/POST /api/v1/users` and `GET/PATCH/DELETE /api/v1/users/:id` have no
  `protect`/`restrictto` middleware at all** on the current backend — anyone
  can list all users or create an admin account. This wasn't touched (out of
  scope for the frontend), but you should lock it down before this goes
  anywhere near production.

## What's not implemented

- Payments/booking (no backend support)
- Geospatial "tours near me" (backend has the endpoints — `/tours-within`,
  `/distances` — but no page calls them yet)
- Admin tour create/edit UI (the backend supports it, but no page was
  requested for it)

## Structure

```
src/
  api/client.js            axios instance, interceptor, response normalizer
  context/AuthContext.jsx  session state: login, signup, logout, init
  routes/                  AppRouter, ProtectedRoute
  features/
    auth/                  api + hooks + LoginForm/SignupForm
    tours/                 api + hooks + TourCard/TourFilters/TourGallery
    reviews/               api + hooks + ReviewCard/List/Form
    users/                 api + hooks + profile forms
  components/
    layout/                Navbar, Footer, MainLayout
    common/                Button, Container, loaders, empty/error states
  pages/                   one file per route
```
