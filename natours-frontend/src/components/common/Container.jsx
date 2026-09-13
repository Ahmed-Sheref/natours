export default function Container({ as: Component = 'div', className = '', children }) {
  return (
    <Component className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </Component>
  );
}
