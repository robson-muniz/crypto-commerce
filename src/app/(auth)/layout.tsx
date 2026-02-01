export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 px-4 sm:px-0 relative z-10">
        <div className="glass-card p-8 rounded-3xl shadow-2xl shadow-primary/10">
          {children}
        </div>
      </div>
    </div>
  );
}
