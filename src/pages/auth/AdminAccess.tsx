import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminAccess: React.FC = () => {
  const { secret } = useParams<{ secret: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const allowedSecret = import.meta.env.VITE_ADMIN_SECRET;

    if (secret === allowedSecret) {
      Swal.fire({
        icon: "success",
        title: "Admin Access",
        text: "Admin login revealed.",
        timer: 1100,
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin-login", { replace: true, state: { allowed: true } });
      });
    } else {
      navigate("/", { replace: true });
    }
  }, [secret, navigate]);

  return null;
};

export default AdminAccess;