// Stub for react-router-dom in Next.js build.
// src/pages/ files reference this package but those files
// are Vite source files, not served as Next.js pages.
export const useNavigate = () => () => {}
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' })
export const NavLink = ({ children }) => children
export const Navigate = () => null
export const Outlet = () => null
export const Link = ({ children }) => children
export const BrowserRouter = ({ children }) => children
export const HashRouter = ({ children }) => children
export const Routes = ({ children }) => children
export const Route = ({ element }) => element ?? null
export const useParams = () => ({})
export const useSearchParams = () => [new URLSearchParams(), () => {}]
