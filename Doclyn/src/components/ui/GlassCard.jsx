export default function GlassCard({ as: Tag = "div", strong = false, className = "", children, ...props }) {
  return (
    <Tag className={`${strong ? "glass-strong" : "glass"} rounded-2xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}
