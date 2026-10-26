import { CheckCircle2, ShieldCheck, Award, Briefcase, Building2 } from "lucide-react";

interface VerificationBadgeProps {
  type: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function VerificationBadge({ type, label, size = "md" }: VerificationBadgeProps) {
  let icon = <CheckCircle2 className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />;

  if (type === "IDENTITY") {
    icon = <ShieldCheck className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />;
  } else if (type === "PROFESSION") {
    icon = <Award className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />;
  } else if (type === "ORGANIZATION") {
    icon = <Building2 className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />;
  }

  const defaultLabel =
    type === "IDENTITY"
      ? "Identity Verified"
      : type === "PROFESSION"
      ? "Licensed Professional"
      : type === "ORGANIZATION"
      ? "Verified Organization"
      : "Verified";

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60 shadow-sm ${sizeStyles[size]}`}
      title={label || defaultLabel}
    >
      <span className="text-emerald-600 dark:text-emerald-400">{icon}</span>
      <span className="font-semibold">{label || defaultLabel}</span>
    </span>
  );
}
