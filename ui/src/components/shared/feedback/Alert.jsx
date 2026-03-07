import { CheckCircle, XCircle, Info } from "lucide-react";

export default function Alert({ type = "info", message }) {
  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      class: "bg-green-100 text-green-800 border-green-300",
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      class: "bg-red-100 text-red-800 border-red-300",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      class: "bg-blue-100 text-blue-800 border-blue-300",
    },
  };

  const current = styles[type];

  return (
    <div
      className={`flex items-center gap-3 border rounded p-3 text-sm ${current.class}`}
    >
      {current.icon}

      <span>{message}</span>
    </div>
  );
}
